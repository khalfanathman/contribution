{
  "type": "array",
  "items": {
    "type": "object",
    "required": [],
    "properties": {
      "id": {
        "type": "string"
      },
      "email": {
        "type": "string"
      },
      "roles": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "apiKey": {
        "type": "string"
      },
      "profile": {
        "type": "object",
        "required": [],
        "properties": {
          "dob": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "about": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "company": {
            "type": "string"
          },
          "location": {
            "type": "object",
            "required": [],
            "properties": {
              "lat": {
                "type": "number"
              },
              "long": {
                "type": "number"
              }
            }
          }
        }
      },
      "username": {
        "type": "string"
      },
      "createdAt": {
        "type": "string"
      },
      "updatedAt": {
        "type": "string"
      }
    }
  }
}