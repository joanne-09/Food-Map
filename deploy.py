import streamlit as st

st.set_page_config(page_title="Restaurant Finder", layout="wide")

st.title("Restaurant Finder")

# HTML and JavaScript for Google Maps
with open("public/index.html") as file:
    html_code = file.read()

st.components.v1.html(html_code, height=600)