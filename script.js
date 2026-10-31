const repositoryList = document.querySelector("#repositories");
const statusMessage = document.querySelector("#status");

function createRepositoryCard(repository) {
  const item = document.createElement("li");
  item.className = "repository-card";

  const link = document.createElement("a");
  link.className = "repository-name";
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repository.name;
  item.append(link);

  if (repository.description) {
    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = repository.description;
    item.append(description);
  }

  const metadata = document.createElement("p");
  metadata.className = "repository-meta";

  if (repository.language) {
    const language = document.createElement("span");
    language.textContent = repository.language;
    metadata.append(language);
  }

  if (repository.starredAt) {
    const starred = document.createElement("time");
    const date = new Date(`${repository.starredAt}T00:00:00`);
    starred.dateTime = repository.starredAt;
    starred.textContent = Number.isNaN(date.getTime())
      ? `Starred on ${repository.starredAt}`
      : `Starred on ${new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date)}`;
    metadata.append(starred);
  }

  if (metadata.childElementCount > 0) {
    item.append(metadata);
  }

  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Could not load repositories (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    repositoryList.replaceChildren(...repositories.map(createRepositoryCard));
    statusMessage.textContent = repositories.length
      ? `${repositories.length} repositories`
      : "No starred repositories yet.";
  } catch (error) {
    statusMessage.textContent = "Could not load repositories. Please try again later.";
    console.error(error);
  }
}

loadRepositories();
