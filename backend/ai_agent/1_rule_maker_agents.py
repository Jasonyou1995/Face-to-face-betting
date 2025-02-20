# Import necessary libraries and setup configuration
import autogen  # Assuming this is the package used to create the agents and orchestrate the process
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify

# Load environment variables
load_dotenv()

# Setup for LLM configuration (adjust this as per your specific setup)
llm_config = {
    "model": "deepseek-chat",  # Model from DeepSeek (update as necessary)
    "api_key": os.getenv("DEEPSEEK_API_KEY"),  # TODO: Ensure this is securely loaded and not exposed
    "base_url": "https://api.deepseek.com"  # TODO: Ensure the base URL is trusted and secure
}

# Define the function for the reflection message
def reflection_message(recipient, messages, sender, config):
    return f'''Review the following content. 
            \n\n {recipient.chat_messages_for_summary(sender)[-1]['content']}'''

# Define the reviewers
game_fairness_reviewer = autogen.AssistantAgent(
    name="Game_Fairness_Reviewer",
    llm_config=llm_config,
    system_message="You are a game fairness reviewer, known for "
        "your expertise in ensuring that game mechanics, rules, and outcomes are fair and balanced for all participants. "
        "Make sure your suggestion is concise (within 3 bullet points), "
        "concrete and to the point. "
        "Begin the review by stating your role."
)

privacy_security_reviewer = autogen.AssistantAgent(
    name="Privacy_Security_Reviewer",
    llm_config=llm_config,
    system_message="You are a privacy and security reviewer, known for "
        "your ability to identify and mitigate potential security and privacy risks. "
        "Make sure your suggestion is concise (within 3 bullet points), "
        "concrete and to the point. "
        "Begin the review by stating your role."
)

ethical_impacts_reviewer = autogen.AssistantAgent(
    name="Ethical_Impacts_Reviewer",
    llm_config=llm_config,
    system_message="You are an ethical impacts reviewer, known for "
        "your ability to evaluate the social, psychological, and ethical implications of a product. "
        "Make sure your suggestion is concise (within 3 bullet points), "
        "concrete and to the point. "
        "Begin the review by stating your role."
)

meta_reviewer = autogen.AssistantAgent(
    name="Meta_Reviewer",
    llm_config=llm_config,
    system_message="You are a meta reviewer, tasked with aggregating and synthesizing the reviews from other specialized reviewers. "
        "You will collect and analyze the summaries of the Game Fairness, Privacy & Security, and Ethical Impacts reviewers. "
        "Your job is to provide a final, cohesive summary that highlights the key suggestions and any potential conflicts or areas of concern. "
        "Your review should prioritize clarity and actionable insights for the rule maker. "
        "Begin your review by stating that you are synthesizing the reviews from the other agents, then summarize their feedback with a focus on resolving any discrepancies and providing a unified final suggestion."
)

# Define the Rule Maker agent
rule_maker = autogen.AssistantAgent(
    name="Rule_Maker",
    system_message="You are the Rule Maker. Your role is to refine and finalize the game rules based on the aggregated feedback from the meta-reviewer. "
        "You must carefully analyze all the suggestions and concerns provided by the fairness, privacy/security, and ethical reviewers, "
        "as well as the consolidated summary from the meta-reviewer. "
        "Your goal is to craft clear, balanced, and fair game rules that address all critical issues while ensuring a smooth, engaging player experience. "
        "Only return the final version of the refined game rules without any additional commentary or explanation."
)

# Define the Critic agent
critic = autogen.AssistantAgent(
    name="Critic",
    llm_config=llm_config,
    system_message="You are a critic. You review the final game rules created by the Rule Maker and provide constructive feedback to help improve the quality, balance, and clarity of the rules. "
        "Your focus is to ensure the rules are not only fair and engaging but also clear, concise, and practical for implementation. "
        "Your suggestions should address potential gaps, ambiguities, or areas that could lead to confusion or unfair play. "
        "Provide your feedback in a concise manner with concrete suggestions for improvements."
)

# Define the nested review chat process
review_chats = [  # This is our nested chat
    {
     "recipient": game_fairness_reviewer, 
     "message": reflection_message, 
     "summary_method": "reflection_with_llm",
     "summary_args": 
        {
        "summary_prompt" : 
        "Return review in JSON format only: "
        "{'Reviewer': 'Game Fairness Reviewer', 'Review': 'Your review content here'}.",
        },
     "max_turns": 1
    },
    
    {
     "recipient": privacy_security_reviewer, 
     "message": reflection_message, 
     "summary_method": "reflection_with_llm",
     "summary_args": 
        {
        "summary_prompt" : 
        "Return review in JSON format only: "
        "{'Reviewer': 'Privacy & Security Reviewer', 'Review': 'Your review content here'}.",
        },
     "max_turns": 1
    },
    
    {
     "recipient": ethical_impacts_reviewer, 
     "message": reflection_message, 
     "summary_method": "reflection_with_llm",
     "summary_args": 
        {
        "summary_prompt" : 
        "Return review in JSON format only: "
        "{'Reviewer': 'Ethics Reviewer', 'Review': 'Your review content here'}.",
        },
     "max_turns": 1
    },
    
    {
     "recipient": meta_reviewer, 
     "message": "Aggregate feedback from all reviewers and provide final suggestions on the writing. "
                "Ensure you synthesize all reviews into a final actionable summary.",
     "max_turns": 1
    },
]

# Register the nested chat process when the Rule Maker sends the first version of the game rule
critic.register_nested_chats(
    review_chats,
    trigger=rule_maker,
)

# Define the task for the Rule Maker
task = '''
        Write a concise but engaging set of game rules for an offline betting app. The rules should be clear, fair, and balanced, 
        ensuring ethical and responsible betting. The rules should be easy to understand and cover key aspects such as 
        betting policies, dispute resolution, and security of funds. Make sure the content is within 200 words.
       '''

# Flask API Setup
app = Flask(__name__)

# POST endpoint to receive user input and process it through the game rule logic
@app.route('/generate_rules', methods=['POST'])
def generate_rules():
    try:
        # Receive JSON input from the frontend
        data = request.get_json()

        # TODO: Ensure input is sanitized and validated
        user_input = data.get('input', '')
        
        if not user_input:
            return jsonify({"error": "No input provided"}), 400

        # Update the task to include user input dynamically
        dynamic_task = f'''
        Write a concise but engaging set of game rules for an offline betting app. The rules should be clear, fair, and balanced, 
        ensuring ethical and responsible betting. The rules should be easy to understand and cover key aspects such as 
        betting policies, dispute resolution, and security of funds. The input provided is: "{user_input}". 
        Make sure the content is within 200 words.
        '''

        # Initiate the critic chat with the dynamic task
        chat_results = critic.initiate_chat(
            recipient=rule_maker,
            message=dynamic_task,
            max_turns=2,
            summary_method="last_msg"
        )

        # Return the final game rules from the task processing
        return jsonify({"result": chat_results['response']}), 200

    except Exception as e:
        # TODO: Handle unexpected errors gracefully
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True)