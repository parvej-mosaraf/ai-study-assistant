from langchain_ollama import ChatOllama

llm = ChatOllama(model="deepseek-coder")

response = llm.invoke(
    """<s>[INST] You are a study assistant. 
    Answer academically. If off-topic, say "Focus on studies!" [/INST]
    User: What is the capital of France?
    Assistant:"""
)

print(response)