use actix_web::{
    HttpResponse,
    Responder,
};
use k8s_openapi::api::core::v1::Pod;
use kube::{
    api::{
        Api,
        PostParams,
    },
    Client,
    Config,
};
use serde_json::json;
use tracing::*;

#[tokio::main]
pub async fn compile() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();
    // Load the Kubernetes configuration from the default kube_config file
    let kube_config = Config::infer().await?;

    // Create a Kubernetes client
    let client = Client::try_from(kube_config)?;

    // Specify the namespace and resource type of the child pod
    let namespace = "default"; // Update with the desired namespace
    let compiler_pod_api: Api<k8s_openapi::api::core::v1::Pod> =
        Api::namespaced(client.clone(), &namespace);

    // Create the child pod specification
    let compiler_pod_spec = json!({
        "apiVersion": "v1",
        "kind": "Pod",
        "metadata": {
            "name": "ink-compiler",
        },
        "spec": {
            "containers": [
                {
                    "name": "ink-compiler-container",
                    "image": "ink-compiler:latest",
                }
            ],
        }
    });

    // Create the child pod using the Kubernetes API
    // let compiler_pod = compiler_pod_api.create(&PostParams::default(), &compiler_pod_spec).await?;
    // println!("Child pod created: {:?}", compiler_pod);

    Ok(())
}

pub async fn dummy_route() -> impl Responder {
    HttpResponse::Ok().finish()
}
