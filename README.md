# 🚀 Zengin AI Debugger (Visual LangChain Debugger)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)

**ENGLISH** | [РУССКИЙ](#-zengin-ai-debugger-визуальный-отладчик-для-langchain-ru)

Stop reading endless console logs! This tool lets you see how your AI agent thinks **in real-time**. Data, prompts, LLMs, and parsers will be rendered as a beautiful interactive graph right in your browser.

This guide is written as simply as possible so absolutely anyone can run it! ☕️
<img width="2549" height="1311" alt="image" src="https://github.com/user-attachments/assets/0713061b-a411-4a54-8ccd-a7f03fc60798" />



## 🛠 How does it work?
The system consists of two parts that communicate with each other:
1. **The Dashboard (Browser UI)** — installed via `npm` (Node.js). It draws the visual graph.
2. **The Plugin (Python)** — installed via `pip`. It intercepts data from LangChain and sends it to the Dashboard.

---

## 📖 Step-by-step Guide for Beginners

### Step 1: Install and run the Dashboard (UI)
*You must have [Node.js](https://nodejs.org/) installed on your computer for this step.*

Open your terminal (command prompt) and run this command for global installation:
```bash
npm install -g zengin-ai-debugger
```

Once the installation is complete, simply type in your terminal:
```bash
zengin-ai-debugger
```
🎉 **Done!** The server is running. A web page will automatically open in your browser at `http://localhost:8000`. Do not close this terminal while working with your AI agents.

*(Alternative: if you don't want to install anything globally, you can just run `npx zengin-ai-debugger`).*

### Step 2: Install the Python library in your project
Open a **second** terminal in your Python project folder and install our plugin:
```bash
pip install zengin-ai-debugger
```

*(Make sure you also have the base libraries installed: `pip install langchain-core httpx`)*

### Step 3: Inject the debugger into your code (just 3 lines!)
Now let's add the magic to your code. Open your Python file containing the LangChain agent.

Here is a ready-to-use example of how to do it:

```python
import asyncio
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 👉 1. IMPORT OUR PLUGIN
from zengin_ai_debugger import RealUIDebuggerCallback

async def main():
    # Create a standard LangChain sequence
    llm = ChatOpenAI(model="gpt-3.5-turbo")
    prompt = PromptTemplate.from_template("Write a fun fact about: {topic}")
    parser = StrOutputParser()
    
    chain = prompt | llm | parser

    # 👉 2. INITIALIZE THE DEBUGGER
    # By default, it will send data to http://localhost:8000
    ui_debugger = RealUIDebuggerCallback()
    
    print("Launching agent... Look at your browser!")

    # 👉 3. PASS THE DEBUGGER TO THE CONFIG WHEN RUNNING
    # IMPORTANT: You must use the asynchronous .ainvoke() method!
    response = await chain.ainvoke(
        {"topic": "Capybaras"}, 
        config={"callbacks": [ui_debugger]} 
    )
    
    print("Response received:", response)

# Run the async code
if __name__ == "__main__":
    asyncio.run(main())
```

### ⚠️ VERY IMPORTANT RULE!
The debugger works in real-time via WebSockets (asynchronously). 
For the graph to be drawn, **you MUST use the asynchronous chain execution method:**
* Correct: `await chain.ainvoke(...)` ✅
* Incorrect: `chain.invoke(...)` ❌

---

## 🎮 How to use the interface
1. Run `zengin-ai-debugger` in the first terminal.
2. Open `http://localhost:8000` in your browser.
3. Run your Python script in the second terminal.
4. Blocks (Nodes) will start appearing in your browser.
5. **Click on any block** to open the side panel. There you will see the exact text that entered this block (Input) and the text the block produced (Output).
6. Click the **"Clear screen"** button to clear the canvas before your next run.

---

## 🧩 Using as a Chrome Extension
If you prefer having the debugger always at hand directly in your browser toolbar:
1. Locate the `dist` folder (it is generated when building the frontend).
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Turn on **Developer mode** (toggle in the top right corner).
4. Click **Load unpacked** and select the `dist` folder.
5. Pin the extension icon. Now the debugger opens with a single click!

*(Note: The bridge server `zengin-ai-debugger` must still be running in your terminal to receive data from Python).*

<br><br><br>

---
---

<a name="-zengin-ai-debugger-визуальный-отладчик-для-langchain-ru"></a>

# 🚀 Zengin AI Debugger (Визуальный отладчик для LangChain) [RU]

Хватит читать бесконечные логи в консоли! Этот инструмент позволяет вам **в реальном времени** видеть, как ваш ИИ-агент думает. Данные, промпты, нейросети и парсеры будут отрисовываться в виде красивого графа прямо в вашем браузере.

Инструкция написана максимально просто, чтобы запустить инструмент смог каждый! ☕️

## 🛠 Как это работает?
Система состоит из двух частей, которые общаются друг с другом:
1. **Дашборд (Интерфейс в браузере)** — устанавливается через `npm` (Node.js). Он рисует граф.
2. **Плагин (Python)** — устанавливается через `pip`. Он перехватывает данные из LangChain и отправляет их в Дашборд.

---

## 📖 Пошаговая инструкция для новичков

### Шаг 1: Установка и запуск Интерфейса (Дашборда)
*Для этого шага на вашем компьютере должен быть установлен [Node.js](https://nodejs.org/).*

Откройте терминал (командную строку) и введите команду для глобальной установки:
```bash
npm install -g zengin-ai-debugger
```

После завершения установки просто напишите в терминале:
```bash
zengin-ai-debugger
```
🎉 **Готово!** Сервер запущен. У вас в браузере автоматически откроется страница `http://localhost:8000`. Не закрывайте этот терминал, пока работаете с агентами.

*(Альтернатива: если не хотите ничего устанавливать глобально, можно просто запустить `npx zengin-ai-debugger`).*

### Шаг 2: Установка Python-библиотеки в ваш проект
Откройте **второй** терминал в папке с вашим Python-проектом и установите наш плагин:
```bash
pip install zengin-ai-debugger
```

*(Убедитесь, что у вас также установлены базовые библиотеки: `pip install langchain-core httpx`)*

### Шаг 3: Внедряем отладчик в ваш код (всего 3 строчки!)
Теперь добавим магию в ваш код. Откройте ваш Python-файл с LangChain агентом. 

Вот готовый пример того, как это делается:

```python
import asyncio
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 👉 1. ИМПОРТИРУЕМ НАШ ПЛАГИН
from zengin_ai_debugger import RealUIDebuggerCallback

async def main():
    # Создаем стандартную цепочку LangChain
    llm = ChatOpenAI(model="gpt-3.5-turbo")
    prompt = PromptTemplate.from_template("Напиши забавный факт про: {topic}")
    parser = StrOutputParser()
    
    chain = prompt | llm | parser

    # 👉 2. СОЗДАЕМ ОТЛАДЧИК
    # Он по умолчанию будет слать данные на http://localhost:8000
    ui_debugger = RealUIDebuggerCallback()
    
    print("Запускаем агента... Смотрите в браузер!")

    # 👉 3. ПЕРЕДАЕМ ОТЛАДЧИК В CONFIG ПРИ ЗАПУСКЕ
    # ВАЖНО: Используйте именно асинхронный метод .ainvoke()!
    response = await chain.ainvoke(
        {"topic": "Капибары"}, 
        config={"callbacks": [ui_debugger]} 
    )
    
    print("Ответ получен:", response)

# Запускаем асинхронный код
if __name__ == "__main__":
    asyncio.run(main())
```

### ⚠️ ОЧЕНЬ ВАЖНОЕ ПРАВИЛО!
Дебаггер работает в реальном времени через веб-сокеты (асинхронно). 
Для того чтобы граф рисовался, **вы ОБЯЗАТЕЛЬНО должны использовать асинхронный запуск цепочки:**
* Правильно: `await chain.ainvoke(...)` ✅
* Неправильно: `chain.invoke(...)` ❌

---

## 🎮 Как пользоваться интерфейсом
1. Запустили `zengin-ai-debugger` в первом терминале.
2. Открыли `http://localhost:8000` в браузере.
3. Запустили ваш Python-скрипт во втором терминале.
4. В браузере начнут появляться блоки (Ноды).
5. **Кликните на любой блок**, чтобы справа открылась панель. Там вы увидите, какой именно текст вошел в этот блок (Input) и какой текст блок выдал в качестве результата (Output).
6. Нажмите кнопку **"Clear screen"**, чтобы очистить холст перед следующим запуском.

---

## 🧩 Использование в виде Chrome-расширения
Если вам удобнее, чтобы отладчик всегда был под рукой прямо в панели браузера:
1. Найдите папку `dist` (она создается при билде фронтенда).
2. Откройте Google Chrome и перейдите по адресу `chrome://extensions/`.
3. Включите **Режим разработчика** (тумблер справа сверху).
4. Нажмите **Загрузить распакованное расширение** и выберите папку `dist`.
5. Закрепите иконку. Теперь отладчик открывается по одному клику!

*(Сервер моста `zengin-ai-debugger` в терминале всё равно должен быть запущен, чтобы получать данные из Python).*
