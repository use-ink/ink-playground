use serde::Deserialize;

fn default_port() -> u16 {
    8080
}

#[derive(Deserialize, Debug, Clone)]
pub struct Config {
    #[serde(default = "default_port")]
    pub port: u16,
    pub frontend_folder: String,
}
