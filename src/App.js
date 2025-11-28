import React, { useEffect, useState } from "react";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";

const initialContacts = [
  {
    id: 1,
    name: "Ananya Rao",
    email: "ananya.rao@example.com",
    phone: "+91 98765 43210",
    company: "Acme Corp",
    role: "Product Manager",
    notes: "Prefers calls in the afternoon.",
    tags: ["VIP", "Important"],
    favorite: true,
  },
  {
    id: 2,
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "+91 90123 45678",
    company: "Nimbus Tech",
    role: "Engineering Lead",
    notes: "Met at AWS Community Day.",
    tags: ["Engineering"],
    favorite: false,
  },
  {
    id: 3,
    name: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    phone: "+91 99887 66554",
    company: "GreenLeaf",
    role: "HR Partner",
    notes: "Looking for automation solutions.",
    tags: ["HR", "Prospect"],
    favorite: false,
  },
];

function App({ signOut, user }) {
  const [attributes, setAttributes] = useState(null);
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedId, setSelectedId] = useState(initialContacts[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const selectedContact = contacts.find((c) => c.id === selectedId) || null;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        const attrs = await fetchUserAttributes();
        setAttributes({ ...attrs, username: currentUser.username });
      } catch (e) {
        console.log("Not logged in", e);
      }
    };

    loadUser();
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleToggleFavorite = (id) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, favorite: !c.favorite } : c
      )
    );
  };

  const handleChangeField = (field, value) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedId ? { ...c, [field]: value } : c
      )
    );
  };

  const handleAddContact = () => {
    const newId = Date.now();
    const newContact = {
      id: newId,
      name: "New Contact",
      email: "",
      phone: "",
      company: "",
      role: "",
      notes: "",
      tags: [],
      favorite: false,
    };
    setContacts((prev) => [newContact, ...prev]);
    setSelectedId(newId);
    setSearch("");
    setShowFavoritesOnly(false);
  };

  const filteredContacts = contacts.filter((c) => {
    const term = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.company.toLowerCase().includes(term);
    const matchesFav = showFavoritesOnly ? c.favorite : true;
    return matchesSearch && matchesFav;
  });

  return (
    <div className="app-root">
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="logo-circle">CM</div>
          <div>
            <div className="topbar-title">Contact Management</div>
            <div className="topbar-subtitle">Cognito protected workspace</div>
          </div>
        </div>
        <div className="topbar-right">
          <div className="user-info">
            <span className="user-avatar">
              {attributes?.email?.[0]?.toUpperCase() || "U"}
            </span>
            <div>
              <div className="user-email">{attributes?.email}</div>
              <div className="user-username">
                {attributes?.username || user?.username}
              </div>
            </div>
          </div>
          <button className="btn btn-outline" onClick={signOut}>
            Logout
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="layout">
        {/* Left: list */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">Contacts</div>
            <button className="btn btn-primary" onClick={handleAddContact}>
              + New
            </button>
          </div>

          <div className="sidebar-search">
            <input
              type="text"
              placeholder="Search by name, email, company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="sidebar-filters">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              />
              <span>Show favourites only</span>
            </label>
          </div>

          <div className="contact-list">
            {filteredContacts.length === 0 && (
              <div className="empty-list">
                No contacts match your search.
              </div>
            )}

            {filteredContacts.map((c) => (
              <div
                key={c.id}
                className={
                  "contact-list-item" +
                  (c.id === selectedId ? " contact-list-item--active" : "")
                }
                onClick={() => handleSelect(c.id)}
              >
                <div className="contact-avatar">
                  {c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="contact-meta">
                  <div className="contact-name-row">
                    <span className="contact-name">{c.name}</span>
                    {c.favorite && <span className="contact-star">★</span>}
                  </div>
                  <div className="contact-email">{c.email || "No email"}</div>
                  <div className="contact-company">
                    {c.company || "No company"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right: detail panel */}
        <main className="detail-panel">
          {!selectedContact && (
            <div className="empty-detail">
              Select a contact from the left, or create a new one.
            </div>
          )}

          {selectedContact && (
            <div className="detail-card">
              <div className="detail-header">
                <div className="detail-title-area">
                  <div className="detail-avatar">
                    {selectedContact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <input
                      className="detail-name-input"
                      value={selectedContact.name}
                      onChange={(e) =>
                        handleChangeField("name", e.target.value)
                      }
                    />
                    <div className="detail-role">
                      <input
                        className="detail-role-input"
                        placeholder="Role"
                        value={selectedContact.role}
                        onChange={(e) =>
                          handleChangeField("role", e.target.value)
                        }
                      />
                      <span className="detail-company-separator">·</span>
                      <input
                        className="detail-company-input"
                        placeholder="Company"
                        value={selectedContact.company}
                        onChange={(e) =>
                          handleChangeField("company", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <button
                  className={
                    "btn btn-favorite" +
                    (selectedContact.favorite ? " btn-favorite--active" : "")
                  }
                  onClick={() => handleToggleFavorite(selectedContact.id)}
                >
                  {selectedContact.favorite ? "★ Favourite" : "☆ Mark favourite"}
                </button>
              </div>

              <div className="detail-grid">
                <div className="detail-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={selectedContact.email}
                    onChange={(e) =>
                      handleChangeField("email", e.target.value)
                    }
                  />
                </div>

                <div className="detail-field">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={selectedContact.phone}
                    onChange={(e) =>
                      handleChangeField("phone", e.target.value)
                    }
                  />
                </div>

                <div className="detail-field detail-field-full">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={selectedContact.tags.join(", ")}
                    onChange={(e) =>
                      handleChangeField(
                        "tags",
                        e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                  <div className="tag-row">
                    {selectedContact.tags.map((tag) => (
                      <span key={tag} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="detail-field detail-field-full">
                  <label>Notes</label>
                  <textarea
                    rows={4}
                    value={selectedContact.notes}
                    onChange={(e) =>
                      handleChangeField("notes", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="detail-footer">
                <span className="detail-hint">
                  Changes are kept in memory for now. Later you can connect this
                  to an API / DynamoDB.
                </span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
