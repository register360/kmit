from flask import Flask, request, jsonify
import os
from datetime import datetime

app = Flask(__name__)

# Path to save data on your desktop
DESKTOP_PATH = os.path.join(os.path.expanduser('~'), 'Desktop')
DATA_FILE = os.path.join(DESKTOP_PATH, 'student_data.txt')

@app.route('/submit', methods=['POST'])
def handle_form():
    try:
        # Get form data
        student_data = {
            'name': request.form.get('name'),
            'mobile': request.form.get('number'),
            'rollno': request.form.get('rollno'),
            'password': request.form.get('password'),  # Note: In real apps, never store plain passwords
            'branch': request.form.get('branch'),
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        # Save to desktop file
        with open(DATA_FILE, 'a') as f:
            f.write(f"{student_data}\n")

        return jsonify({
            'status': 'success',
            'message': 'Data saved successfully!',
            'saved_to': DATA_FILE
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
