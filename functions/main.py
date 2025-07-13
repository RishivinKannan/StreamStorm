from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore

from google.cloud.firestore import (
    Client as FireStoreClient,
    DocumentReference,
    DocumentSnapshot,
    Increment,
)

initialize_app()

@https_fn.on_call(
    cors=options.CorsOptions(cors_origins=["*"], cors_methods=["*"]),
    enforce_app_check=True
)
def visit_count(req: https_fn.Request) -> https_fn.Response:
    print("Visit count function triggered...")    
    
    db: FireStoreClient = firestore.client()
    doc_ref: DocumentReference = db.collection("streamstorm").document("counts")
    
    doc_ref.update({"visit": Increment(1)})
    
    doc: DocumentSnapshot = doc_ref.get()
        
    return {
        "success": True, 
        "count": doc.to_dict().get("visit", 0)
    }


@https_fn.on_call(
    cors=options.CorsOptions(cors_origins=["*"], cors_methods=["*"]),
    enforce_app_check=True
)
def downloads_count(req: https_fn.Request) -> https_fn.Response:
    print("Downloads count function triggered...")
    
    data: dict = req.data
    
    db: FireStoreClient = firestore.client()
    doc_ref: DocumentReference = db.collection("streamstorm").document("counts")
    
    if data.get("mode") == "set":
        doc_ref.update({"downloads": Increment(1)})
    
    doc: DocumentSnapshot = doc_ref.get()

    return {
        "success": True,
        "count": doc.to_dict().get("downloads", 0)
    }

