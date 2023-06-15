use actix_web::{
    web::Json,
    HttpResponse,
    Responder,
};
use kube::{
    api::{
        Api,
        PostParams,
    },
    Client,
    Config,
};
use sandbox::CompilationRequest;
use serde_json::json;

pub async fn compile(
    req: Json<CompilationRequest>,
    namespace: Option<String>,
) -> impl Responder {
    tracing_subscriber::fmt::init();
    // Load the Kubernetes configuration from the default kube_config file
    // ToDo: proper error handling
    let kube_config = Config::infer().await.expect("infer kube_config");

    // Create a Kubernetes client
    let client = Client::try_from(kube_config).expect("derive client");

    // Specify the namespace and resource type of the child pod
    let namespace = "default"; // Update with the desired namespace
    let compiler_pod_api: Api<k8s_openapi::api::core::v1::Pod> =
        Api::namespaced(client.clone(), &namespace);

    // Create the child pod specification
    // ToDo: proper error handling
    let compiler_pod_spec = serde_json::from_value(json!({
        "apiVersion": "v1",
        "kind": "Job",
        "metadata": {
            "name": "ink-compiler",
            // ToDo: set correct env variable for namespace
            "nameSpace": namespace.unwrap_or("default"),
        },
        "spec": {
            "containers": [
                {
                    "name": "ink-compiler-container",
                    "image": "ink-compiler",
                    "volumeMounts": {
                        "mountPath": "/contract-folder",
                        "name": "contract-folder"
                    }
                }
            ],
            "restartPolicy": "Never",
        }
    }))
    .expect("derive compiler_pod_spec from json");

    // Create the child pod using the Kubernetes API
    // ToDo: proper error handling
    let compiler_pod = compiler_pod_api
        .create(&PostParams::default(), &compiler_pod_spec)
        .await
        .expect("create pod");
    println!("Child pod created: {:?}", compiler_pod);

    HttpResponse::Ok().finish()
}

pub async fn dummy_route() -> impl Responder {
    HttpResponse::Ok().finish()
}
