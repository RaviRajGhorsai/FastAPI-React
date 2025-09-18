from appwrite.client import Client
from appwrite.services.account import Account

client = Client()
client.set_endpoint("https://syd.cloud.appwrite.io/v1")
client.set_project("68ca698a00199c7868cd")

account = Account(client)