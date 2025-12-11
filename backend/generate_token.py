import sys
import os
from datetime import timedelta

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.security import create_access_token
from app.core.config import settings

def generate_user_token():
    """
    Generates a JWT token for a specific user.
    """
    # The user ID or username for whom the token is generated.
    # Replace "liuzhongwang2" with the actual user identifier from your database.
    user_id = "liuzhongwang2"
    
    # Generate the access token
    access_token = create_access_token(
        subject=user_id,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    print(f"Generated JWT Token for user '{user_id}':\n")
    print(access_token)

if __name__ == "__main__":
    generate_user_token()