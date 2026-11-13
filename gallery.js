document.addEventListener("DOMContentLoaded", () => {
	const images = document.querySelectorAll(".gallery img");
	if (!images.length) return;

	const overlay = document.createElement("div");
	overlay.className = "lightbox";
	overlay.setAttribute("role", "dialog");
	overlay.setAttribute("aria-modal", "true");
	overlay.setAttribute("aria-label", "放大圖片");
	overlay.innerHTML = `
		<button class="lightbox-close" type="button" aria-label="關閉放大圖片">&times;</button>
		<img class="lightbox-image" alt="">
		<a class="lightbox-download" href="#" download>下載圖片</a>
	`;
	document.body.appendChild(overlay);

	const enlargedImage = overlay.querySelector(".lightbox-image");
	const closeButton = overlay.querySelector(".lightbox-close");
	const downloadButton = overlay.querySelector(".lightbox-download");

	const close = () => {
		overlay.classList.remove("is-visible");
		enlargedImage.classList.remove("is-zoomed");
		document.body.classList.remove("lightbox-open");
	};

	const open = (image) => {
		enlargedImage.src = image.src;
		enlargedImage.alt = image.alt;
		downloadButton.href = image.src;
		overlay.classList.add("is-visible");
		document.body.classList.add("lightbox-open");
		closeButton.focus();
	};

	images.forEach((image) => {
		image.tabIndex = 0;
		image.setAttribute("role", "button");
		image.addEventListener("click", () => open(image));
		image.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				open(image);
			}
		});
	});

	closeButton.addEventListener("click", close);
	enlargedImage.addEventListener("click", () => {
		enlargedImage.classList.toggle("is-zoomed");
	});
	overlay.addEventListener("click", (event) => {
		if (event.target === overlay) close();
	});
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && overlay.classList.contains("is-visible")) {
			close();
		}
	});
});
