// Copyright 2018-2021 Parity Technologies (UK) Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use serde::Deserialize;

fn default_port() -> u16 {
    8080
}

#[derive(Deserialize, Debug, Clone, PartialEq)]
pub struct Config {
    #[serde(default = "default_port")]
    pub port: u16,
    pub frontend_folder: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_correct_args() {
        let args = vec![
            ("PORT".to_string(), "1234".to_string()),
            ("FRONTEND_FOLDER".to_string(), "foobar".to_string()),
        ];

        let result = envy::from_iter::<_, Config>(args);

        assert_eq!(
            result,
            Ok(Config {
                port: 1234,
                frontend_folder: "foobar".to_string(),
            })
        );
    }

    #[test]
    fn test_missing_frontend_folder() {
        let args = vec![("PORT".to_string(), "1234".to_string())];

        let result = envy::from_iter::<_, Config>(args);

        assert!(result.is_err());
    }

    #[test]
    fn test_port_wrong_type() {
        let args = vec![
            ("PORT".to_string(), "\"1234\"".to_string()),
            ("FRONTEND_FOLDER".to_string(), "foobar".to_string()),
        ];

        let result = envy::from_iter::<_, Config>(args);

        assert!(result.is_err());
    }
}
