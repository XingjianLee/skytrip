import requests

def run() -> None:
    base = "http://localhost:8000"
    username = "skytrip_dev"
    password = "Dev@123456"
    try:
        lr = requests.post(
            f"{base}/api/v1/auth/login",
            data={"username": username, "password": password},
            timeout=10,
        )
        if lr.status_code == 200:
            print(lr.json().get("access_token", ""))
            return
        cr = requests.post(
            f"{base}/api/v1/users/",
            json={
                "username": username,
                "password": password,
                "real_name": "Dev User",
                "id_card": "ID0000000000",
                "email": "dev@skytrip.local",
                "phone": "00000000000",
            },
            timeout=10,
        )
        if cr.status_code not in (200, 201):
            print("auth failed")
            return
        lr2 = requests.post(
            f"{base}/api/v1/auth/login",
            data={"username": username, "password": password},
            timeout=10,
        )
        if lr2.status_code == 200:
            print(lr2.json().get("access_token", ""))
        else:
            try:
                print(lr2.text)
            except Exception:
                pass
            print("auth failed")
    except Exception as e:
        print("auth failed")


if __name__ == "__main__":
    run()
