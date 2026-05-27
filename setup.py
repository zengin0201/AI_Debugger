from setuptools import setup, find_packages

setup(
    name="zengin_ai_debugger",       
    version="1.0.7",               
    description="Visual real-time debugger for LangChain AI agents",
    author="Alexey Borodin",
    packages=["zengin_ai_debugger"], 
    package_dir={"zengin_ai_debugger": "python-package"},           
    install_requires=[
        "requests",                     
        "langchain-core"             
    ],
    python_requires=">=3.8",
)
