from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer

app = Flask(__name__)

device = "cuda"  # the device to load the model onto
model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")
tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")

responses = []

@app.route("/generate-response", methods=["POST"])
def generate_response():
    user_input = request.json.get("user_input")
    messages = [{"role": "user", "content": user_input}]
    if responses:
        messages.append({"role": "assistant", "content": responses[-1]})

    encodeds = tokenizer.apply_chat_template(messages, return_tensors="pt").to(device)

    generated_ids = model.generate(encodeds, max_new_tokens=1000, do_sample=True)
    decoded = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]

    responses.append(decoded)

    return jsonify({"response": decoded})

if __name__ == "__main__":
    app.run(debug=True)
