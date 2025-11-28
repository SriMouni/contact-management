import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function App({ signOut, user }) {
  const [attributes, setAttributes] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setAttributes(currentUser.attributes);
      } catch (e) {
        console.log("Not logged in", e);
      }
    };

    loadUser();
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1.5rem" }}>
      <h1>Contact Management (AWS Auth Enabled)</h1>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Logged in as:</strong>{" "}
        {user?.username || attributes?.email || "Unknown"}
      </div>

      {attributes && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: "1rem",
            borderRadius: "8px",
            maxWidth: "500px",
            overflowX: "auto",
          }}
        >
{JSON.stringify(attributes, null, 2)}
        </pre>
      )}

      <button
        onClick={signOut}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        Logout
      </button>

      <hr style={{ margin: "2rem 0" }} />

      <h2>Protected Area</h2>
      <p>
        Add your contact-management components here. This whole page is only
        visible to authenticated users because the App component is wrapped in
        withAuthenticator.
      </p>
    </div>
  );
}

export default withAuthenticator(App);
