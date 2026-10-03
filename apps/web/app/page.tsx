"use client";

import { FormEvent, useState } from "react";

type AuthMode = "login" | "register";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const categories = [
    "Tout",
    "Musique",
    "Vidéos",
    "Shorts",
    "Live",
    "Podcasts",
    "Éducation",
    "Sport",
    "Divertissement",
  ];

  const trending = [
    {
      title: "Global Sounds",
      creator: "Streamtube Music",
      type: "Musique",
      views: "2,4 M écoutes",
    },
    {
      title: "Les créateurs du monde",
      creator: "Streamtube Originals",
      type: "Documentaire",
      views: "1,8 M vues",
    },
    {
      title: "Live Session",
      creator: "Streamtube Live",
      type: "Live",
      views: "845 k spectateurs",
    },
    {
      title: "Nouvelle génération",
      creator: "Streamtube",
      type: "Vidéo",
      views: "623 k vues",
    },
  ];

  const sections = [
    {
      title: "Musique populaire",
      items: [
        "Nouveaux sons",
        "Top artistes",
        "Albums du moment",
        "Playlists populaires",
      ],
    },
    {
      title: "Nouveaux créateurs",
      items: [
        "Créateurs à découvrir",
        "Artistes émergents",
        "Nouvelles chaînes",
        "Talents du monde",
      ],
    },
  ];

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setMessage("");
    setAuthOpen(true);
  }

  function closeAuth() {
    if (loading) return;

    setAuthOpen(false);
    setMessage("");
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const endpoint =
        authMode === "login"
          ? "http://localhost:3001/auth/login"
          : "http://localhost:3001/auth/register";

      const body =
        authMode === "login"
          ? {
              email,
              password,
            }
          : {
              email,
              username,
              password,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Une erreur est survenue.",
        );
      }

      if (authMode === "login" && data.accessToken) {
        localStorage.setItem("streamtube_access_token", data.accessToken);
      }

      setMessage(
        authMode === "login"
          ? `Bienvenue ${data.username} ! Connexion réussie.`
          : `Compte créé avec succès pour ${data.username}.`,
      );

      setEmail("");
      setUsername("");
      setPassword("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible de contacter le serveur.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center gap-6 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl font-black text-black">
            S
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            Streamtube
          </h1>
        </div>

        <div className="flex flex-1 justify-center">
          <input
            type="text"
            placeholder="Rechercher des vidéos, musiques, artistes..."
            className="w-full max-w-2xl rounded-full border border-gray-700 bg-gray-900 px-6 py-3 text-white outline-none placeholder:text-gray-500 focus:border-gray-400"
          />
        </div>

        <nav className="hidden items-center gap-5 text-sm text-gray-300 xl:flex">
          <span className="cursor-pointer hover:text-white">
            Accueil
          </span>
          <span className="cursor-pointer hover:text-white">
            Musique
          </span>
          <span className="cursor-pointer hover:text-white">
            Vidéos
          </span>
          <span className="cursor-pointer hover:text-white">
            Shorts
          </span>
          <span className="cursor-pointer hover:text-white">
            Live
          </span>
        </nav>

        <button
          onClick={() => openAuth("login")}
          className="rounded-full bg-white px-5 py-2.5 font-semibold text-black transition hover:bg-gray-200"
        >
          Se connecter
        </button>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 md:px-12 lg:px-20">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
          La nouvelle génération du streaming
        </p>

        <h2 className="max-w-5xl text-5xl font-bold leading-tight md:text-6xl">
          Découvrez, écoutez et partagez les créateurs du monde
          entier.
        </h2>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-400">
          Streamtube réunit musique, vidéos, Shorts, live et
          communauté sur une seule plateforme.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={() => openAuth("register")}
            className="rounded-full bg-white px-7 py-3.5 font-semibold text-black transition hover:bg-gray-200"
          >
            Commencer
          </button>

          <button className="rounded-full border border-gray-700 px-7 py-3.5 font-semibold text-white transition hover:border-gray-400">
            Découvrir
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 pb-10 md:px-12 lg:px-20">
        <div className="flex gap-3 overflow-x-auto pb-3">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
                index === 0
                  ? "bg-white text-black"
                  : "border border-gray-700 bg-gray-950 text-gray-300 hover:border-gray-500 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="px-6 pb-20 md:px-12 lg:px-20">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Découverte mondiale
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            Tendances mondiales
          </h3>

          <p className="mt-2 text-gray-500">
            Ce que la communauté regarde et écoute en ce moment.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((content) => (
            <article
              key={content.title}
              className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 transition hover:-translate-y-1 hover:border-gray-600"
            >
              <div className="flex aspect-video items-center justify-center bg-gray-900">
                <span className="text-4xl font-black text-gray-700">
                  ▶
                </span>
              </div>

              <div className="p-5">
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  {content.type}
                </p>

                <h4 className="mt-2 text-lg font-semibold">
                  {content.title}
                </h4>

                <p className="mt-2 text-sm text-gray-400">
                  {content.creator}
                </p>

                <p className="mt-3 text-xs text-gray-600">
                  {content.views}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Other sections */}
      {sections.map((section) => (
        <section
          key={section.title}
          className="border-t border-gray-900 px-6 py-16 md:px-12 lg:px-20"
        >
          <h3 className="text-3xl font-bold">{section.title}</h3>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {section.items.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-800 bg-gray-950 p-6 transition hover:border-gray-600"
              >
                <div className="mb-6 flex h-24 items-center justify-center rounded-xl bg-gray-900">
                  <span className="text-3xl text-gray-700">♪</span>
                </div>

                <h4 className="font-semibold">{item}</h4>

                <p className="mt-2 text-sm text-gray-500">
                  Découvrez les nouveautés sur Streamtube.
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Auth modal */}
      {authOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-gray-950 p-8 shadow-2xl">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  Streamtube
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {authMode === "login"
                    ? "Se connecter"
                    : "Créer un compte"}
                </h3>
              </div>

              <button
                onClick={closeAuth}
                className="text-2xl text-gray-500 transition hover:text-white"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  E-mail
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  placeholder="exemple@email.com"
                  className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-400"
                />
              </div>

              {authMode === "register" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Nom d'utilisateur
                  </label>

                  <input
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    required
                    minLength={3}
                    maxLength={30}
                    placeholder="monpseudo"
                    className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-400"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Mot de passe
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  minLength={8}
                  maxLength={128}
                  placeholder="Minimum 8 caractères"
                  className="w-full rounded-xl border border-gray-700 bg-black px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-400"
                />
              </div>

              {message && (
                <div className="rounded-xl border border-gray-800 bg-black p-4 text-sm text-gray-300">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-white px-5 py-3.5 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Chargement..."
                  : authMode === "login"
                    ? "Se connecter"
                    : "Créer mon compte"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              {authMode === "login" ? (
                <>
                  Pas encore de compte ?{" "}
                  <button
                    onClick={() => openAuth("register")}
                    className="font-semibold text-white hover:underline"
                  >
                    Créer un compte
                  </button>
                </>
              ) : (
                <>
                  Déjà un compte ?{" "}
                  <button
                    onClick={() => openAuth("login")}
                    className="font-semibold text-white hover:underline"
                  >
                    Se connecter
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}