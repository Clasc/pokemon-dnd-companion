## Product Specification: Pokémon & D&D Companion App (MVP)

### 1. Introduction

This specification describes the Minimum Viable Product (MVP) of a **Single Page Application (SPA)** designed as a companion app for a homebrewed version of Dungeons & Dragons with Pokémon elements. The app is primarily for players and aims to simplify character and Pokémon management on mobile devices and tablets.

---

### 2. Target Audience

The primary user is a **player** in a campaign. The Game Master (DM) is not the main target audience. The app should support the flow of the game, not complicate it.

---

### 3. Technical Requirements

* **Type:** Single Page Application (SPA).
* **Platform:** Optimized for mobile browsers (iOS/Android) and tablets. No native app is planned for the MVP.
* **Technology Stack:**
    * **Frontend:** HTML5, CSS3, JavaScript (e.g., using a framework like Vue.js or React).
    * **Data Persistence:** Local storage (LocalStorage) will be used to save player data without needing a backend database.

---

### 4. Features (MVP)

#### 4.1. Main View: Character & Pokémon

The app's home screen is divided into two clear, switchable sections:

* **Character Overview:**
    * Input field for the **character's name**.
    * Input fields for the player's **Level** and **Class**.
    * Input fields for the character's **D&D attributes** (Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma).
    * Input field for the current and maximum **Hit Points (HP)**.
    * HP can be adjusted with simple "+" and "-" buttons.

* **Pokémon Overview:**
    * A list of the player's Pokémon (up to 6).
    * Each Pokémon displays its **Name** and **Level**.
    * An **HP bar** visually represents the current HP relative to the maximum HP.
    * Tapping on a Pokémon opens a detailed profile (see 4.2).

#### 4.2. Pokémon Details View

Selecting a Pokémon takes the player to a new view with the following information and features:

* **Pokémon Profile:**
    * **Name:** Display field.
    * **D&D Attributes:** Input fields for the attributes **Strength, Dexterity, Constitution, Intelligence, Wisdom,** and **Charisma**.
    * **Level & XP:** The current level and an editable field for accumulated **XP**. A progress bar visualizes the progress toward the next level.
    * **HP:** Current and maximum HP with simple adjustment options. An **HP bar** visualizes the Pokémon's current condition.
    * **Attacks:** An editable list of up to 4 attacks. Each attack has a field for its **Name** and a field for a short **description** (e.g., "d10 damage, causes fear on a 19+").

---

### 5. User Interaction & Workflow

The entire workflow is designed for simplicity and based on a clear **read-only mode**.

1.  The player opens the app. All values are in **read-only mode** by default and cannot be changed accidentally.
2.  To edit values, the player must explicitly switch to **edit mode** (e.g., via an "Edit" button).
3.  In **edit mode**, the player can adjust their character's or Pokémon's attributes, HP, XP, or attacks.
4.  After editing, the player saves the changes and returns to **read-only mode** to prevent unintentional modifications.
5.  The player can update a Pokémon's XP, which will automatically update the progress bar.

---

### 6. Not Included in the MVP (Future Scope)

* Backend or user account system.
* Combat simulation or dice-rolling interface.
* Game Master (DM) functionalities like a bestiary.
* Status effect tracker (e.g., for poison or burn).
* Graphics and images of the Pokémon.
* Special Pokémon abilities (as they only have attacks).
