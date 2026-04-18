import os

css = open('frontend/src/styles/global.css', encoding='utf-8').read()

def clean_component(path):
    content = open(path, encoding='utf-8').read()
    lines = content.split('\n')
    clean_lines = [l for l in lines if not l.startswith('import ')]
    content = '\n'.join(clean_lines)
    content = content.replace('export default function', 'function')
    return content

auth = clean_component('frontend/src/components/Auth.jsx')
coach3d = clean_component('frontend/src/components/Coach3D.jsx')
dash = clean_component('frontend/src/components/Dashboard.jsx')
food = clean_component('frontend/src/components/FoodScanner.jsx')
gamif = clean_component('frontend/src/components/GamificationHUD.jsx')
voice = clean_component('frontend/src/components/VoiceCoach.jsx')

app = open('frontend/src/App.tsx', encoding='utf-8').read()
app_lines = app.split('\n')
app_clean = [l for l in app_lines if not l.startswith('import ') and not l.startswith('export default ')]
app_clean = '\n'.join(app_clean)

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitSense AI OS</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;800&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.client.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
{css}
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
const {{ useState, useEffect, useRef }} = React;

{auth}
{coach3d}
{dash}
{food}
{gamif}
{voice}

{app_clean}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
    </script>
</body>
</html>
"""

with open('frontend/demo.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("demo.html generated")
