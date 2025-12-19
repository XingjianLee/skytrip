from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "a_very_secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    # SQLALCHEMY_DATABASE_URI = "postgresql://root:liwenjun040824@localhost/skytrip"
    SQLALCHEMY_DATABASE_URI: str = "mysql+pymysql://root:liwenjun040824@localhost/skytrip"
    AI_BASE_URL: str | None = None
    AI_API_KEY: str | None = None
    AI_MODEL: str | None = None
    AI_TIMEOUT_SECONDS: int = 20
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
