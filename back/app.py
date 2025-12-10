from flask import Flask
from flask_cors import CORS
from flask_session import Session
from config import Config
from db_setup import db
from routes.users_routes import users_bp, init_oauth
from routes.events_routes import events_bp
from routes.images_routes import images_bp
from routes.news_routes import news_bp
from routes.videos_routes import videos_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.secret_key = Config.SECRET_KEY

    # --- SESIÓN ---
    app.config.update({
        "SESSION_TYPE": "filesystem",
        "SESSION_COOKIE_SAMESITE": "Lax",  # obligatorio para cross-site
        "SESSION_COOKIE_SECURE": False       # True solo si HTTPS
    })
    Session(app)  # 🔹 debe estar DENTRO de create_app()

    # --- CORS ---
    CORS(app, supports_credentials=True, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173"],  # frontend
            "allow_headers": ["Content-Type", "Authorization"],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "supports_credentials": True
        }
    })

    db.init_app(app)
    init_oauth(app)

    app.register_blueprint(users_bp)
    app.register_blueprint(events_bp)
    app.register_blueprint(images_bp)
    app.register_blueprint(news_bp)
    app.register_blueprint(videos_bp)

    @app.route("/")
    def index():
        return {"message": "API del sistema deportivo activa"}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="localhost", port=5000, debug=True)
