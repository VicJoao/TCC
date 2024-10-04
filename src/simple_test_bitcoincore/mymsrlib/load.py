from dotenv import load_dotenv
import os


def load_query(path):
    """
    Load the query from the given path

    :param path: str, the path to the query file
    :return: str, the query
    """
    with open(path, 'r') as file:
        query = file.read()
    return query


def load_token(path):
    """
    Load the GitHub token from the .env file
    :param path: str, the path to the .env file
    :return: None
    """
    # Load environment variables from the .env file
    load_dotenv(path)

    # Get the GitHub token from the environment variable
    token = os.getenv('GH_TOKEN')

    # If failed to find token
    if token is None:
        raise ValueError("GitHub token is not set. Check your .env file.")

    return token
