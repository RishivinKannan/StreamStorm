from logging import Logger, getLogger
from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore

from google.cloud.firestore import (
    Client as FireStoreClient,
    DocumentReference,
    DocumentSnapshot,
    Increment,
)

ss_logger: Logger = getLogger("streamstorm")

initialize_app()


options.set_global_options(
    region="asia-south1",
    enforce_app_check=True,
)

def get_doc_ref(collection: str, document: str) -> DocumentReference:
    db: FireStoreClient = firestore.client()
    return db.collection(collection).document(document)

@https_fn.on_call(
    cors=options.CorsOptions(cors_origins=["*"], cors_methods=["*"]),
)
def visit_count(req: https_fn.Request) -> https_fn.Response:
    ss_logger.info("Visit count function triggered...")

    doc_ref: DocumentReference = get_doc_ref("streamstorm", "counts")

    doc_ref.update({"visit": Increment(1)})

    doc: DocumentSnapshot = doc_ref.get()

    count: int = doc.to_dict().get("visit", 0)

    ss_logger.info(f"New visit count: {count}")

    return {"success": True, "count": count}


@https_fn.on_call(
    cors=options.CorsOptions(cors_origins=["*"], cors_methods=["*"]),
)
def downloads_count(req: https_fn.Request) -> https_fn.Response:
    ss_logger.info("Downloads count function triggered...")

    data: dict = req.data
    ss_logger.debug(f"Request data: {data}")

    doc_ref: DocumentReference = get_doc_ref("streamstorm", "counts")

    if data.get("mode") == "set":
        doc_ref.update({"downloads": Increment(1)})

    doc: DocumentSnapshot = doc_ref.get()
    
    count: int = doc.to_dict().get("downloads", 0)
    
    ss_logger.info(f"New downloads count: {count}")

    return {"success": True, "count": count}
