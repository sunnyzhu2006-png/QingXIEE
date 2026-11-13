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
	let offsetX = 0;
	let offsetY = 0;
	let dragStartX = 0;
	let dragStartY = 0;
	let isDragging = false;
	let movedDuringDrag = false;

	const resetZoomPosition = () => {
		offsetX = 0;
		offsetY = 0;
		enlargedImage.style.setProperty("--zoom-x", "0px");
		enlargedImage.style.setProperty("--zoom-y", "0px");
	};

	const close = () => {
		overlay.classList.remove("is-visible");
		enlargedImage.classList.remove("is-zoomed");
		resetZoomPosition();
		document.body.classList.remove("lightbox-open");
	};

	const open = (image) => {
		enlargedImage.src = image.src;
		enlargedImage.alt = image.alt;
		downloadButton.href = image.src;
		resetZoomPosition();
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
		if (movedDuringDrag) {
			movedDuringDrag = false;
			return;
		}
		enlargedImage.classList.toggle("is-zoomed");
		if (!enlargedImage.classList.contains("is-zoomed")) resetZoomPosition();
	});
	enlargedImage.addEventListener("pointerdown", (event) => {
		if (!enlargedImage.classList.contains("is-zoomed")) return;
		isDragging = true;
		movedDuringDrag = false;
		dragStartX = event.clientX - offsetX;
		dragStartY = event.clientY - offsetY;
		enlargedImage.setPointerCapture(event.pointerId);
		enlargedImage.classList.add("is-dragging");
	});
	enlargedImage.addEventListener("pointermove", (event) => {
		if (!isDragging) return;
		offsetX = event.clientX - dragStartX;
		offsetY = event.clientY - dragStartY;
		if (Math.abs(offsetX) > 3 || Math.abs(offsetY) > 3) movedDuringDrag = true;
		enlargedImage.style.setProperty("--zoom-x", `${offsetX}px`);
		enlargedImage.style.setProperty("--zoom-y", `${offsetY}px`);
	});
	enlargedImage.addEventListener("pointerup", (event) => {
		if (!isDragging) return;
		isDragging = false;
		enlargedImage.releasePointerCapture(event.pointerId);
		enlargedImage.classList.remove("is-dragging");
	});
	enlargedImage.addEventListener("pointercancel", () => {
		isDragging = false;
		enlargedImage.classList.remove("is-dragging");
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
