import ProjectGallery from "@/components/projects/project-gallery";

export default function GalleryTestPage() {
  return (
    <main className="mx-auto max-w-5xl p-8 pt-32">
      <ProjectGallery
        media={["/__test.mp4", "/me.jpg", "/__test.mp4"]}
        title="Gallery test"
      />
    </main>
  );
}
