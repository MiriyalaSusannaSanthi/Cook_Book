import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CATEGORY_SECTIONS = [
  { label: "Breakfast", icon: "🌅" },
  { label: "Lunch", icon: "☀️" },
  { label: "Dinner", icon: "🌙" },
  { label: "Snacks", icon: "🍿" },
  { label: "Drinks", icon: "🥤" },
  { label: "Dessert", icon: "🍰" },
];

export default function Home() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/recipes")
      .then((res) => setRecipes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(" ")[0] || "Chef";

  const filtered = search
    ? recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.ingredients?.some((i) =>
            i.name.toLowerCase().includes(search.toLowerCase())
          )
      )
    : [];

  const getByCategory = (cat) =>
    recipes.filter((r) => r.category === cat);

  return (
    <div className="page" style={styles.page}>

      {/* ── Hero ── */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div>
            <p style={styles.greeting}>Hello, {firstName}! 👋</p>
            <h1 style={styles.heroTitle}>
              What shall we<br />cook today?
            </h1>
          </div>
          <div style={styles.heroIllustration}>🍳</div>
        </div>

        {/* Search */}
        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search recipes, ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} style={styles.clearBtn}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={styles.body}>

        {/* Search Results */}
        {search ? (
          <div>
            <p style={styles.searchResultTitle}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
              "{search}"
            </p>
            {filtered.length === 0 ? (
              <div style={styles.empty}>
                <p style={{ fontSize: "3rem" }}>🍳</p>
                <p style={styles.emptyTitle}>No recipes found</p>
                <p style={styles.emptySub}>Try a different ingredient</p>
              </div>
            ) : (
              <div style={styles.searchGrid}>
                {filtered.map((r) => (
                  <HorizCard key={r._id} recipe={r} big />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Featured Banner — first recipe */}
            {!loading && recipes.length > 0 && (
              <FeaturedBanner recipe={recipes[0]} />
            )}

            {/* Category Sections */}
            {loading ? (
              <SkeletonSections />
            ) : (
              CATEGORY_SECTIONS.map((cat) => {
                const items = getByCategory(cat.label);
                if (items.length === 0) return null;
                return (
                  <CategorySection
                    key={cat.label}
                    icon={cat.icon}
                    label={cat.label}
                    recipes={items}
                  />
                );
              })
            )}

            {/* All Recipes Section */}
            {!loading && recipes.length > 0 && (
              <CategorySection
                icon="🍽️"
                label="All Recipes"
                recipes={recipes}
                showAll
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Featured Banner ──────────────────────────
function FeaturedBanner({ recipe }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likes, setLikes] = useState(recipe?.likes?.length || 0);
  const [liked, setLiked] = useState(
    recipe?.likes?.some((id) => id === user?.id) || false
  );

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await API.put(`/recipes/${recipe._id}/like`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch {}
  };

  return (
    <div
      style={banner.wrap}
      onClick={() => navigate(`/recipe/${recipe._id}`)}
    >
      {recipe.imageURL ? (
        <img src={recipe.imageURL} alt={recipe.title} style={banner.img} />
      ) : (
        <div style={banner.noImg}>🍳</div>
      )}
      <div style={banner.overlay} />
      <div style={banner.topRow}>
        <span style={banner.featuredBadge}>⭐ Featured</span>
        <button onClick={handleLike} style={banner.likeBtn}>
          {liked ? "❤️" : "🤍"} {likes}
        </button>
      </div>
      <div style={banner.bottom}>
        <span style={banner.catBadge}>{recipe.category}</span>
        <h2 style={banner.title}>{recipe.title}</h2>
        <div style={banner.metaRow}>
          <span style={banner.metaItem}>⏱ {recipe.cookTime} mins</span>
          <span style={banner.metaItem}>🍽 {recipe.servings} servings</span>
          <span style={banner.metaItem}>
            👤 {recipe.createdBy?.name?.split(" ")[0] || "Chef"}
          </span>
        </div>
      </div>
    </div>
  );
}

const banner = {
  wrap: {
    position: "relative", width: "100%", height: "220px",
    borderRadius: "20px", overflow: "hidden",
    cursor: "pointer", marginBottom: "28px",
    boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  noImg: {
    width: "100%", height: "100%", background: "#FFF4F0",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "5rem",
  },
  overlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
  },
  topRow: {
    position: "absolute", top: "12px",
    left: "14px", right: "14px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  featuredBadge: {
    background: "#FF6B35", color: "#fff",
    fontSize: "11px", fontWeight: "700",
    padding: "4px 12px", borderRadius: "20px",
  },
  likeBtn: {
    background: "rgba(255,255,255,0.2)",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "20px", color: "#fff",
    fontSize: "12px", fontWeight: "600",
    padding: "4px 12px", cursor: "pointer",
  },
  bottom: {
    position: "absolute", bottom: "14px",
    left: "14px", right: "14px",
  },
  catBadge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.2)",
    color: "#fff", fontSize: "10px",
    fontWeight: "700", padding: "3px 10px",
    borderRadius: "20px", marginBottom: "6px",
    letterSpacing: "0.5px",
    border: "1px solid rgba(255,255,255,0.3)",
  },
  title: {
    color: "#fff", fontSize: "20px", fontWeight: "800",
    margin: "0 0 8px", lineHeight: 1.2,
    textShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
  metaRow: { display: "flex", gap: "12px", flexWrap: "wrap" },
  metaItem: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "12px", fontWeight: "500",
  },
};

// ── Category Section ─────────────────────────
function CategorySection({ icon, label, recipes, showAll }) {
  const navigate = useNavigate();
  const displayRecipes = showAll ? recipes.slice(0, 10) : recipes;

  return (
    <div style={section.wrap}>
      <div style={section.header}>
        <div style={section.titleRow}>
          <span style={section.icon}>{icon}</span>
          <h3 style={section.title}>{label}</h3>
          <span style={section.count}>{recipes.length}</span>
        </div>
        <button
          onClick={() => {}}
          style={section.seeAll}
        >
          See all →
        </button>
      </div>
      <div style={section.scroll}>
        {displayRecipes.map((recipe) => (
          <HorizCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

const section = {
  wrap: { marginBottom: "28px" },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "12px",
  },
  titleRow: { display: "flex", alignItems: "center", gap: "8px" },
  icon: { fontSize: "18px" },
  title: {
    fontSize: "16px", fontWeight: "800",
    color: "#1C1C1E", margin: 0,
  },
  count: {
    background: "#FFF4F0", color: "#FF6B35",
    fontSize: "11px", fontWeight: "700",
    padding: "2px 8px", borderRadius: "20px",
  },
  seeAll: {
    background: "none", border: "none",
    color: "#FF6B35", fontSize: "13px",
    fontWeight: "600", cursor: "pointer",
  },
  scroll: {
    display: "flex", gap: "12px",
    overflowX: "auto", paddingBottom: "6px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
};

// ── Horizontal Scroll Card ───────────────────
function HorizCard({ recipe, big }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likes, setLikes] = useState(recipe?.likes?.length || 0);
  const [liked, setLiked] = useState(
    recipe?.likes?.some((id) => id === user?.id) || false
  );

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await API.put(`/recipes/${recipe._id}/like`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch {}
  };

  const cardWidth = big ? "100%" : "150px";
  const imgHeight = big ? "160px" : "110px";

  return (
    <div
      style={{ ...card.wrap, width: cardWidth, flexShrink: big ? 0 : 0 }}
      onClick={() => navigate(`/recipe/${recipe._id}`)}
    >
      {/* Image */}
      <div style={{ ...card.imgBox, height: imgHeight }}>
        {recipe.imageURL ? (
          <img src={recipe.imageURL} alt={recipe.title} style={card.img} />
        ) : (
          <div style={{ ...card.noImg, height: imgHeight }}>🍳</div>
        )}
        <div style={card.imgOverlay} />
        <button onClick={handleLike} style={card.likeBtn}>
          <span style={{ fontSize: "10px" }}>{liked ? "❤️" : "🤍"}</span>
        </button>
        <span style={card.timeBadge}>⏱ {recipe.cookTime}m</span>
      </div>

      {/* Info */}
      <div style={card.info}>
        <p style={card.catLabel}>{recipe.category?.toUpperCase()}</p>
        <p style={{ ...card.title, fontSize: big ? "15px" : "13px" }}>
          {recipe.title}
        </p>
        <div style={card.metaRow}>
          <div style={card.authorRow}>
            <div style={card.authorDot}>
              {recipe.createdBy?.name?.charAt(0)?.toUpperCase() || "C"}
            </div>
            <span style={card.authorName}>
              {recipe.createdBy?.name?.split(" ")[0] || "Chef"}
            </span>
          </div>
          <span style={card.likes}>❤️ {likes}</span>
        </div>
      </div>
    </div>
  );
}

const card = {
  wrap: {
    background: "#fff", borderRadius: "16px",
    overflow: "hidden", cursor: "pointer",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    border: "1px solid #F5F5F5",
    transition: "transform 0.15s",
    flexShrink: 0,
  },
  imgBox: {
    position: "relative", width: "100%",
    overflow: "hidden", background: "#FFF4F0",
  },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  noImg: {
    width: "100%", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "2rem", background: "#FFF4F0",
  },
  imgOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: "40%",
    background: "linear-gradient(transparent, rgba(0,0,0,0.25))",
  },
  likeBtn: {
    position: "absolute", top: "6px", right: "6px",
    background: "rgba(255,255,255,0.92)", border: "none",
    borderRadius: "50%", width: "24px", height: "24px",
    display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
  },
  timeBadge: {
    position: "absolute", bottom: "6px", left: "6px",
    background: "rgba(0,0,0,0.5)", color: "#fff",
    fontSize: "9px", fontWeight: "700",
    padding: "2px 7px", borderRadius: "8px",
  },
  info: { padding: "10px 10px 12px" },
  catLabel: {
    fontSize: "9px", fontWeight: "700",
    color: "#FF6B35", letterSpacing: "0.6px", margin: "0 0 3px",
  },
  title: {
    fontWeight: "700", color: "#1C1C1E",
    margin: "0 0 8px", lineHeight: 1.3,
    display: "-webkit-box", WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  metaRow: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between",
  },
  authorRow: { display: "flex", alignItems: "center", gap: "4px" },
  authorDot: {
    width: "16px", height: "16px", borderRadius: "50%",
    background: "#FF6B35", color: "#fff",
    display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "8px", fontWeight: "700",
  },
  authorName: { fontSize: "10px", color: "#9CA3AF", fontWeight: "500" },
  likes: { fontSize: "10px", color: "#9CA3AF", fontWeight: "600" },
};

// ── Skeleton ─────────────────────────────────
function SkeletonSections() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ marginBottom: "28px" }}>
          <div className="skeleton" style={{
            height: "20px", width: "120px",
            borderRadius: "8px", marginBottom: "14px",
          }} />
          <div style={{ display: "flex", gap: "12px", overflow: "hidden" }}>
            {[1, 2, 3].map((j) => (
              <div key={j} className="skeleton" style={{
                width: "150px", height: "200px",
                borderRadius: "16px", flexShrink: 0,
              }} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#F8F9FA", paddingBottom: "100px" },
  hero: {
    background: "linear-gradient(135deg, #FF6B35 0%, #FF9A3C 100%)",
    padding: "20px 16px 48px",
  },
  heroInner: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: "18px",
  },
  greeting: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "13px", fontWeight: "500", marginBottom: "4px",
  },
  heroTitle: {
    color: "#fff", fontSize: "22px",
    fontWeight: "800", lineHeight: 1.25, margin: 0,
  },
  heroIllustration: {
    fontSize: "48px",
    filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.15))",
  },
  searchBar: {
    background: "#fff", borderRadius: "14px",
    display: "flex", alignItems: "center", gap: "10px",
    padding: "6px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  },
  searchIcon: { fontSize: "14px", flexShrink: 0 },
  searchInput: {
    flex: 1, border: "none", outline: "none",
    fontSize: "14px", padding: "9px 0",
    background: "transparent", color: "#1C1C1E",
  },
  clearBtn: {
    background: "#F3F4F6", border: "none",
    borderRadius: "50%", width: "22px", height: "22px",
    cursor: "pointer", color: "#9CA3AF", fontSize: "11px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  body: { padding: "0 14px 20px", marginTop: "-24px" },
  searchResultTitle: {
    fontSize: "14px", fontWeight: "700",
    color: "#1C1C1E", marginBottom: "14px",
  },
  searchGrid: { display: "flex", flexDirection: "column", gap: "12px" },
  empty: {
    textAlign: "center", padding: "60px 20px",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "8px",
  },
  emptyTitle: { fontSize: "16px", fontWeight: "700", color: "#1C1C1E" },
  emptySub: { fontSize: "13px", color: "#9CA3AF" },
};