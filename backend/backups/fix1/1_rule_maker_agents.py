# Fixed and improved agent workflow with proper response handling
import autogen
import os
import json
from dotenv import load_dotenv
from flask import Flask, request, jsonify

load_dotenv()

# Improved LLM configuration with JSON mode
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

# Modified reflection message to capture rule content
def reflection_message(recipient, messages, sender, config):
    last_message = recipient.chat_messages[sender][-1]['content']
    return f'''Review the following game rules:
{last_message}
Provide specific feedback in JSON format: {{"reviewer": "your_name", "feedback": ["item1", "item2"]}}'''

# Enhanced agents with structured output requirements
rule_maker = autogen.AssistantAgent(
    name="Rule_Maker",
    system_message="""You are a game rule expert. Create rules that are:
- Fair and balanced
- Include clear win/lose conditions
- Specify dispute resolution
- Detail fund security measures
- Ethical and responsible

Format output as JSON:
{
  "title": "Game Title",
  "rules": ["list", "of", "rules"],
  "verification": "method",
  "dispute_resolution": "process",
  "fund_security": "measures"
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

Return feedback in JSON format with "score" (1-10) and "issues" list.""",
        llm_config=llm_config
    )

reviewers = [
    create_reviewer("Fairness_Reviewer", "game balance and fairness"),
    create_reviewer("Security_Reviewer", "data privacy and fund security"),
    create_reviewer("Ethics_Reviewer", "ethical implications and responsible gaming")
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

# Fixed chat workflow
def process_rules(task):
    # Generate initial rules
    user_proxy.initiate_chat(
        rule_maker,
        message=task,
        summary_method="last_msg"
    )
    initial_rules = rule_maker.last_message()['content']
    
    # Conduct reviews
    feedback = []
    for reviewer in reviewers:
        user_proxy.initiate_chat(
            reviewer,
            message=f"Review these game rules:\n{initial_rules}",
            summary_method="last_msg"
        )
        feedback.append(reviewer.last_message()['content'])
    
    # Meta-review
    user_proxy.initiate_chat(
        meta_reviewer,
        message=f"Combine these reviews:\n{json.dumps(feedback)}",
        summary_method="last_msg"
    )
    
    # Final revision
    user_proxy.initiate_chat(
        rule_maker,
        message=f"Revise rules based on:\n{meta_reviewer.last_message()['content']}",
        summary_method="last_msg"
    )
    
    return rule_maker.last_message()['content']

# Flask API with improved handling
app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        "status": "active",
        "service": "Rule Generation API",
        "available_endpoints": {
            "/generate_rules": "POST - Generate game rules from text input"
        }
    }), 200

@app.route('/generate_rules', methods=['POST'])
def generate_rules():
    try:
        # Ensure proper JSON content type
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 415
            
        data = request.get_json()
        user_input = data.get('input', '')
        
        if not user_input.strip():
            return jsonify({"error": "Input cannot be empty"}), 400
            
        task = f'''Create betting rules for: {user_input}
        Requirements:
        - Max 200 words
        - Clear dispute resolution
        - Secure fund handling
        - Ethical guidelines'''
        
        final_rules = process_rules(task)
        
        # Improved JSON validation
        try:
            validated = json.loads(final_rules)
            if not isinstance(validated, dict):
                raise ValueError("Top-level structure must be JSON object")
            return jsonify(validated), 200
        except json.JSONDecodeError as e:
            return jsonify({"error": f"Invalid JSON format: {str(e)}"}), 500
        except ValueError as e:
            return jsonify({"error": str(e)}), 500
            
    except Exception as e:
        return jsonify({"error": f"Processing error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=False, port=5000)