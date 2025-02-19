# Fixed and enhanced AI Agent code with proper error handling
from autogen import AssistantAgent, GroupChatManager, GroupChat, UserProxyAgent
import json

# Configuration with error handling
try:
    llm_config = {
        "model": "deepseek-chat",
        "api_key": "API_KEY",  # Use straight quotes, not curly quotes
        "base_url": "https://api.deepseek.com",
        "temperature": 0.7,
        "max_tokens": 500,
        "request_timeout": 30
    }
    
    # Prompt engineering for betting rules
    def create_task_prompt(topic: str) -> str:
        return f"""Create a fair betting rule for: {topic}
        Requirements:
        1. Must include clear win/lose conditions
        2. Define stake handling (funds transfer)
        3. Specify verification method
        4. Include dispute resolution process
        5. Time limit for outcome determination
        6. Format as JSON with title, rules, verification steps
        
        Example structure:
        {{
            "title": "Cultural Origin Challenge",
            "rules": [
                "Players must approach 3 different strangers",
                "Ask about birth country/nationality",
                "Majority answer determines winner"
            ],
            "verification": "Video recording required",
            "stake": "Held in escrow until resolution",
            "time_limit": "30 minutes"
        }}"""

    # Agent definitions with improved system prompts
    rule_writer = AssistantAgent(
        name="RuleWriter",
        system_message="""You are a professional betting rule creator. Follow these steps:
        1. Analyze the user's betting topic
        2. Generate 3 potential rule variations
        3. Select the most fair and implementable version
        4. Output STRICTLY in the required JSON format""",
        llm_config=llm_config,
        max_consecutive_auto_reply=2
    )

    rule_critic = AssistantAgent(
        name="RuleCritic",
        system_message="""You are a quality assurance expert. Analyze rules for:
        1. Fairness between parties
        2. Clear victory conditions
        3. Practical verification methods
        4. Ethical compliance
        5. Return structured feedback in JSON format:
        {{
            "valid": boolean,
            "issues": ["list of issues"],
            "suggestions": ["improvement ideas"]
        }}""",
        llm_config=llm_config
    )

    # User proxy for interaction
    user_proxy = UserProxyAgent(
        name="UserProxy",
        human_input_mode="NEVER",
        code_execution_config=False,
        default_auto_reply="Continue with analysis"
    )

    # Improved group chat configuration
    groupchat = GroupChat(
        agents=[user_proxy, rule_writer, rule_critic],
        messages=[],
        max_round=5
    )
    manager = GroupChatManager(groupchat=groupchat, llm_config=llm_config)

    # Execution flow with error handling
    def generate_rules(topic: str):
        try:
            task = create_task_prompt(topic)
            response = user_proxy.initiate_chat(
                manager,
                message=task,
                summary_method="last_msg"
            )
            return validate_response(response.last_message)
        except json.JSONDecodeError as e:
            print(f"JSON Error: {str(e)}")
            return {"error": "Invalid response format"}
        except Exception as e:
            print(f"API Error: {str(e)}")
            return {"error": "Service unavailable"}

    def validate_response(response: str) -> dict:
        try:
            data = json.loads(response)
            required_fields = ["title", "rules", "verification"]
            if all(field in data for field in required_fields):
                return data
            return {"error": "Missing required fields"}
        except json.JSONDecodeError:
            return {"error": "Invalid JSON structure"}

    # Example usage
    if __name__ == "__main__":
        result = generate_rules("Guessing a stranger's origin")
        print(json.dumps(result, indent=2))

except ImportError as e:
    print(f"Missing dependency: {str(e)}")
except KeyError as e:
    print(f"Configuration error: {str(e)}")