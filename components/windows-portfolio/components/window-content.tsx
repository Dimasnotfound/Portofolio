import type { Dispatch, SetStateAction } from "react";

import styles from "../windows-portfolio.module.css";
import { projects, skills } from "../lib/data";
import type { ContactForm, Project, WindowId } from "../lib/types";

type WindowContentProps = {
  contactForm: ContactForm;
  id: WindowId;
  onOpenWindow: (id: WindowId) => void;
  onResetContactForm: () => void;
  onSelectProject: Dispatch<SetStateAction<Project | null>>;
  onSubmitContact: () => void;
  setContactForm: Dispatch<SetStateAction<ContactForm>>;
};

export function WindowContent({
  contactForm,
  id,
  onOpenWindow,
  onResetContactForm,
  onSelectProject,
  onSubmitContact,
  setContactForm,
}: WindowContentProps) {
  if (id === "about") {
    return (
      <div className={`${styles.windowBody} ${styles.aboutLayout}`}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>Details</div>
          <button
            type="button"
            className={styles.sidebarLink}
            onClick={() => onOpenWindow("skills")}
          >
            My Skills
          </button>
          <button
            type="button"
            className={styles.sidebarLink}
            onClick={() => onOpenWindow("projects")}
          >
            Projects
          </button>
          <button
            type="button"
            className={styles.sidebarLink}
            onClick={() => onOpenWindow("contact")}
          >
            Contact
          </button>
        </aside>

        <div className={styles.contentPane}>
          <h2 className={styles.sectionTitle}>Tentang Saya</h2>

          <div className={styles.aboutHeader}>
            <div className={styles.profileBadge}>
              <img
                src="/profile-dimas.jpg"
                alt="Foto Dimas Juli Pratama"
                className={styles.profileBadgeImage}
                draggable="false"
              />
            </div>
            <div className={styles.aboutCopy}>
              <h3>Dimas Juli Pratama</h3>
              <p>
                Mahasiswa Informatika semester 8 di Universitas Jember dengan IPK 3.87/4.00,
                berfokus pada fullstack development dan sistem berbasis AI.
              </p>
              <p>
                Saya memiliki pengalaman lebih dari dua tahun mengerjakan proyek freelance dan
                profesional, membangun aplikasi web maupun mobile end-to-end dengan perhatian pada
                backend architecture, API integration, performance, usability, dan maintainability.
              </p>
            </div>
          </div>

          <div className={styles.dataTable}>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Nama</span>
              <span>Dimas Juli Pratama</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Lokasi</span>
              <span>Banyuwangi, Jawa Timur</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Pendidikan</span>
              <span>S1 Informatika, Universitas Jember</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>IPK</span>
              <span className={styles.statusText}>3.87 / 4.00</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Fokus</span>
              <span>Fullstack Development & AI Systems</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataKey}>Email</span>
              <span>dp4369344@gmail.com</span>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <strong>2+</strong>
              <span>Tahun Pengalaman</span>
            </div>
            <div className={styles.statBox}>
              <strong>8th</strong>
              <span>Semester Saat Ini</span>
            </div>
            <div className={styles.statBox}>
              <strong>2026</strong>
              <span>Expected Graduation</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "skills") {
    return (
      <div className={styles.windowBody}>
        <h2 className={styles.sectionTitle}>My Skills</h2>
        <div className={styles.skillsCatalog}>
          {skills.map((group) => (
            <section key={group.group} className={styles.skillCategoryCard}>
              <div className={styles.skillCategoryHeader}>
                <div>
                  <h3>{group.group}</h3>
                  <p>{group.summary}</p>
                </div>
                <span className={styles.skillCategoryMeta}>{group.items.length} items</span>
              </div>

              <div className={styles.skillTileGrid}>
                {group.items.map((item) => (
                  <article key={item.name} className={styles.skillTile}>
                    <div className={styles.skillTileIconBox}>
                      <img
                        src={item.icon}
                        alt=""
                        className={styles.skillTileIcon}
                        draggable="false"
                      />
                    </div>
                    <div className={styles.skillTileText}>
                      <strong>{item.name}</strong>
                      {item.note ? <span>{item.note}</span> : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (id === "projects") {
    return (
      <div className={styles.windowBody}>
        <h2 className={styles.sectionTitle}>Proyek Pilihan</h2>

        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <button
              key={project.title}
              type="button"
              className={styles.projectCard}
              onClick={() => onSelectProject(project)}
            >
              <div className={styles.projectCardTitle}>
                <span
                  className={styles.projectCardBadge}
                  style={{ background: `linear-gradient(135deg, ${project.accent}, #123155)` }}
                />
                <span>{project.title}</span>
              </div>
              <p className={styles.projectSubtitle}>{project.subtitle}</p>
              <p>{project.description}</p>
              <div className={styles.projectTags}>
                {project.tech.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <p className={styles.helperNote}>
          Klik proyek untuk melihat detail stack dan konteks penggunaan.
        </p>
      </div>
    );
  }

  if (id === "contact") {
    return (
      <div className={styles.windowBody}>
        <h2 className={styles.sectionTitle}>Contact</h2>
        <p className={styles.contactLead}>
          Terbuka untuk freelance, kolaborasi produk, pengembangan dashboard internal,
          mobile app, dan integrasi backend untuk kebutuhan nyata.
        </p>

        <div className={styles.formRow}>
          <label htmlFor="contact-name">Nama / Instansi</label>
          <input
            id="contact-name"
            value={contactForm.name}
            onChange={(event) =>
              setContactForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            placeholder="Nama Anda atau nama perusahaan"
          />
        </div>

        <div className={styles.formRow}>
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            type="email"
            value={contactForm.email}
            onChange={(event) =>
              setContactForm((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            placeholder="email@anda.com"
          />
        </div>

        <div className={styles.formRow}>
          <label htmlFor="contact-message">Project Brief</label>
          <textarea
            id="contact-message"
            value={contactForm.message}
            onChange={(event) =>
              setContactForm((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            placeholder="Jelaskan kebutuhan proyek, stack, timeline, atau bentuk kolaborasi yang Anda cari."
          />
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={`${styles.xpButton} ${styles.primaryButton}`}
            onClick={onSubmitContact}
          >
            Kirim Pesan
          </button>
          <button
            type="button"
            className={styles.xpButton}
            onClick={onResetContactForm}
          >
            Bersihkan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.windowBody} ${styles.doomBody}`}>
      <div className={styles.doomToolbar}>
        <span className={styles.doomHint}>
          Arrows bergerak, klik area game untuk fokus, dan gunakan tab baru untuk main
          fullscreen.
        </span>
        <a
          href="/doom.html"
          target="_blank"
          rel="noreferrer"
          className={styles.doomAction}
        >
          Open Fullscreen
        </a>
      </div>
      <iframe
        src="/doom.html"
        title="DOOM"
        className={styles.doomFrame}
        allow="fullscreen"
      />
    </div>
  );
}
