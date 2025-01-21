import streamlit as st

st.set_page_config(page_title="Restaurant Finder", layout="wide")

st.title("Restaurant Finder")

# HTML and JavaScript for Google Maps
with open("src/index.html") as file:
    html_code = file.read()
# with open("./api_key.txt") as file:
#     api_key = file.read()
api_key = "A"
html_code = html_code.replace("API_KEY", api_key)

st.components.v1.html(html_code, height=600)