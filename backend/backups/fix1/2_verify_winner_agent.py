# Fixed and enhanced winner verification agent
import autogen
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Configure LLM with JSON response format
llm_config = {
    "config_list": [{
        "model": "deepseek-chat",
        "api_key": os.getenv("DEEPSEEK_API_KEY"),
        "base_url": "https://api.deepseek.com",
        "temperature": 0.7,
        "max_tokens": 500,
        "response_format": {"type": "json_object"}
    }]
}

# Enhanced reflection message with content validation
def reflection_message(recipient, messages, sender, config):
    content = recipient.chat_messages[sender][-1]['content']
    if not content.strip():
        return "Error: No content provided for review. Please include game outcome details."
    return f'''Review the following game outcome:
{content}
Provide specific feedback in JSON format:
{{
  "reviewer": "your_name",
  "assessment": "fair|unfair|needs_more_info",
  "issues": ["list of concerns"],
  "suggestions": ["improvement ideas"]
}}'''

# Enhanced winner verifier with structured output
winner_verifier = autogen.AssistantAgent(
    name="Winner_Verifier",
    system_message="""Analyze game outcome data and determine winner. 
Input format:
{
  "player_a": {"actions": ["list"], "score": number},
  "player_b": {"actions": ["list"], "score": number},
  "rules": ["list of game rules"]
}

Output format:
{
  "winner": "A|B|Draw",
  "reason": "detailed explanation",
  "confidence": "high|medium|low"
}""",
    llm_config=llm_config
)

# Unified reviewer template
def create_reviewer(name, expertise):
    return autogen.AssistantAgent(
        name=name,
        system_message=f"""As {name}, focus on {expertise}. Provide:
1. Specific improvement suggestions
2. Potential issues to address
3. Compliance checks

Return feedback in JSON format:
{{
  "reviewer": "{name}",
  "assessment": "valid|invalid|needs_revision",
  "issues": ["list"],
  "suggestions": ["list"]
}}""",
        llm_config=llm_config
    )

# Define specialized reviewers
reviewers = [
    create_reviewer("Fairness_Reviewer", "game outcome fairness"),
    create_reviewer("Security_Reviewer", "data integrity and verification"),
    create_reviewer("Ethics_Reviewer", "ethical implications of outcome")
]

# Enhanced meta-reviewer
meta_reviewer = autogen.AssistantAgent(
    name="Meta_Reviewer",
    system_message="""Analyze all reviews and create unified improvement plan:
1. Prioritize critical issues
2. Resolve conflicting feedback
3. Suggest actionable changes

Output JSON format:
{
  "status": "approve|revise",
  "required_changes": ["list"],
  "priority": "high|medium|low"
}""",
    llm_config=llm_config
)

# New proxy agent to manage workflow
user_proxy = autogen.UserProxyAgent(
    name="Admin",
    human_input_mode="NEVER",
    code_execution_config=False,
    default_auto_reply="Continue processing",
    max_consecutive_auto_reply=1
)

# Fixed verification workflow
def verify_winner(game_data):
    # Validate input
    try:
        data = json.loads(game_data)
        required = ["player_a", "player_b", "rules"]
        if not all(key in data for key in required):
            return {"error": "Invalid game data format"}
    except json.JSONDecodeError:
        return {"error": "Invalid JSON input"}

    # Step 1: Initial verification
    user_proxy.initiate_chat(
        winner_verifier,
        message=f"Verify winner for:\n{game_data}",
        summary_method="last_msg"
    )
    initial_verdict = winner_verifier.last_message()['content']
    
    # Step 2: Conduct reviews
    feedback = []
    for reviewer in reviewers:
        user_proxy.initiate_chat(
            reviewer,
            message=f"Review this winner verification:\n{initial_verdict}",
            summary_method="last_msg"
        )
        feedback.append(reviewer.last_message()['content'])
    
    # Step 3: Meta-review
    user_proxy.initiate_chat(
        meta_reviewer,
        message=f"Combine these reviews:\n{json.dumps(feedback)}",
        summary_method="last_msg"
    )
    
    # Step 4: Final revision
    user_proxy.initiate_chat(
        winner_verifier,
        message=f"Revise verification based on:\n{meta_reviewer.last_message()['content']}",
        summary_method="last_msg"
    )
    
    return winner_verifier.last_message()['content']

# Example usage
if __name__ == "__main__":
    sample_data = '''{
        "player_a": {
            "actions": ["correct guess 1", "incorrect guess 2"],
            "score": 1
        },
        "player_b": {
            "actions": ["correct guess 1", "correct guess 2"],
            "score": 2
        },
        "rules": [
            "Each correct guess scores 1 point",
            "Player with highest score wins"
        ]
    }'''
    
    result = verify_winner(sample_data)
    print(json.dumps(json.loads(result), indent=2)