# 🚀 Zengin AI Debugger (Visual LangChain Debugger)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![npm version](https://img.shields.io/npm/v/zengin-ai-debugger.svg?color=blue)](https://www.npmjs.com/package/zengin-ai-debugger)
[![PyPI version](https://img.shields.io/pypi/v/zengin-ai-debugger.svg?color=blue)](https://pypi.org/project/zengin-ai-debugger/)

**ENGLISH** | [РУССКИЙ](#-zengin-ai-debugger-визуальный-отладчик-для-langchain-ru)

Tired of reading endless black-and-white text logs in your console? 
This tool lets you see exactly how your AI agent thinks **in real-time**. Data, prompts, neural networks, and tools will be drawn as a beautiful, interactive graph right in your browser.

This guide is written for absolute beginners. You can set it up in 2 minutes! ☕️

<img width="800" alt="Zengin AI Debugger Demo" src="https://github.com/user-attachments/assets/4a35530f-52d6-4127-967b-5485f4ed2999" />

---

## 🛑 Before we start (Prerequisites)
Make sure you have these two basic things installed on your computer:
1. **[Node.js](https://nodejs.org/)** (Required to run the visual dashboard).
2. **[Python](https://www.python.org/)** (Required to run your AI code).

---

## 📖 Step-by-Step Guide for Beginners

### Step 1: Start the Visual Dashboard
Open your terminal (Command Prompt on Windows or Terminal on Mac) and type:
```bash
npm install -g zengin-ai-debugger
```
Wait for it to install. Then, start the dashboard by typing:
```bash
zengin-ai-debugger
```
🎉 **Done!** A web page will automatically open in your browser at `http://localhost:8000`. 
> ⚠️ **IMPORTANT:** Do NOT close this terminal window! Just minimize it. If you close it, the dashboard will stop working.

### Step 2: Install the Python Plugin
Open a **new, second terminal** (navigate to the folder where you write your Python code). Install our Python helper:
```bash
pip install zengin-ai-debugger
```

### Step 3: Add 3 lines of magic to your code!
Open your Python file with your LangChain code. You just need to import our debugger and tell LangChain to use it. 

Here is a ready-to-use example:

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 👉 1. IMPORT THE DEBUGGER
from zengin_ai_debugger import RealUIDebuggerCallback

# (Your standard LangChain code)
# Note: Make sure you have your OPENAI_API_KEY set in your environment!
llm = ChatOpenAI(model="gpt-3.5-turbo")
prompt = PromptTemplate.from_template("Write a fun fact about: {topic}")
parser = StrOutputParser()

chain = prompt | llm | parser

# 👉 2. TURN ON THE DEBUGGER
ui_debugger = RealUIDebuggerCallback()

print("Launching AI... Look at your browser!")

# 👉 3. ADD IT TO THE CONFIG WHEN RUNNING YOUR CHAIN
response = chain.invoke(
    {"topic": "Capybaras"}, 
    config={"callbacks": [ui_debugger]} # <--- ADD THIS LINE!
)

print("Response:", response)
```

### Step 4: Watch the magic happen!
1. Make sure `http://localhost:8000` is open in your browser.
2. Run your Python script in your second terminal (`python your_script.py`).
3. Watch the blocks appear on your screen in real-time! 
4. **Click on any block** to see exactly what text went IN (Input) and what text came OUT (Output), plus how much money/tokens it cost!

---

## 🚑 Troubleshooting (FAQ)

* **I typed `npm install...` but it says "command not found".**
  You don't have Node.js installed. Download it from [nodejs.org](https://nodejs.org/), install it, restart your PC, and try again.
* **The graph doesn't appear in the browser!**
  Make sure your first terminal (where you typed `zengin-ai-debugger`) is still running and doesn't show any errors.
* **I got `ModuleNotFoundError: No module named 'zengin_ai_debugger'` in Python.**
  Make sure you ran `pip install zengin-ai-debugger` in the exact same environment/terminal where you are running your script.

<br><br><br>

---
---

<a name="-zengin-ai-debugger-визуальный-отладчик-для-langchain-ru"></a>

# 🚀 Zengin AI Debugger (Визуальный отладчик для LangChain) [RU]

Устали читать бесконечные черно-белые логи в консоли? 
Этот инструмент позволяет **в реальном времени** видеть, как именно думает ваш ИИ. Данные, промпты, нейросети и инструменты будут рисоваться в виде красивого интерактивного графа прямо в браузере.

Инструкция написана для абсолютных новичков. Вы запустите всё за 2 минуты! ☕️

## 🛑 Перед стартом (Что нужно иметь)
Убедитесь, что на вашем компьютере установлены две базовые программы:
1. **[Node.js](https://nodejs.org/)** (Нужен, чтобы работал визуальный интерфейс).
2. **[Python](https://www.python.org/)** (Нужен для запуска вашего ИИ-кода).

---

## 📖 Инструкция для чайников (Шаг за шагом)

### Шаг 1: Запускаем визуальный интерфейс (Дашборд)
Откройте терминал (Командную строку в Windows или Terminal в Mac) и введите:
```bash
npm install -g zengin-ai-debugger
```
Дождитесь окончания загрузки. Затем просто введите:
```bash
zengin-ai-debugger
```
🎉 **Готово!** У вас в браузере автоматически откроется страница `http://localhost:8000`. 
> ⚠️ **ВАЖНО:** НЕ закрывайте это окно терминала! Просто сверните его. Если вы его закроете, интерфейс перестанет получать данные.

### Шаг 2: Устанавливаем библиотеку для Python
Откройте **новое, второе окно терминала** (перейдите в папку, где лежит ваш код на Python). Установите наш плагин:
```bash
pip install zengin-ai-debugger
```

### Шаг 3: Добавляем 3 строчки магии в ваш код!
Откройте ваш Python-файл. Вам нужно только импортировать наш отладчик и сказать Лангчейну использовать его. 

Вот готовый пример, можете его скопировать:

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 👉 1. ИМПОРТИРУЕМ ОТЛАДЧИК
from zengin_ai_debugger import RealUIDebuggerCallback

# (Ваш обычный код LangChain)
# Не забудьте указать свой OPENAI_API_KEY в переменных среды!
llm = ChatOpenAI(model="gpt-3.5-turbo")
prompt = PromptTemplate.from_template("Напиши забавный факт про: {topic}")
parser = StrOutputParser()

chain = prompt | llm | parser

# 👉 2. ВКЛЮЧАЕМ ОТЛАДЧИК
ui_debugger = RealUIDebuggerCallback()

print("Запускаем ИИ... Откройте браузер!")

# 👉 3. ДОБАВЛЯЕМ ОТЛАДЧИК В НАСТРОЙКИ ПРИ ЗАПУСКЕ
response = chain.invoke(
    {"topic": "Капибары"}, 
    config={"callbacks": [ui_debugger]} # <--- ДОБАВЬТЕ ЭТУ СТРОЧКУ!
)

print("Ответ получен:", response)
```

### Шаг 4: Наслаждаемся результатом!
1. Убедитесь, что в браузере открыта вкладка `http://localhost:8000`.
2. Запустите ваш Python-скрипт во втором терминале (например, `python my_bot.py`).
3. Смотрите, как блоки появляются на экране прямо в процессе работы!
4. **Кликните на любой блок**, чтобы увидеть, какой именно текст в него вошел (Input), что он выдал (Output), а также сколько денег и токенов он потратил!

---

## 🚑 Решение частых проблем (FAQ)

* **Я пишу `npm install...`, а мне выдает "команда не найдена" (command not found).**
  У вас не установлен Node.js. Скачайте его с сайта [nodejs.org](https://nodejs.org/), установите, перезагрузите компьютер и попробуйте снова.
* **Скрипт отработал, но в браузере ничего не появилось!**
  Убедитесь, что ваш первый терминал (где вы писали `zengin-ai-debugger`) всё ещё открыт и в нем нет красных ошибок.
* **Python выдает ошибку `ModuleNotFoundError: No module named 'zengin_ai_debugger'`.**
  Вы забыли установить библиотеку для Питона. Убедитесь, что вы написали `pip install zengin-ai-debugger` в том же самом терминале/окружении, откуда запускаете свой скрипт бота.
```
