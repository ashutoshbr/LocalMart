from fastapi import FastAPI
from .routers import user, auth, product
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def get_root():
    return {"msg": "Namaste"}


app.include_router(user.router)
app.include_router(auth.router)
app.include_router(product.router)
