import Image from "next/image";
import { reviews, storeConfig } from "@/data/store";

export function ReviewsSection() {
  return (
    <section className="reviews">
      <div className="alert rating-summary">
        <b className="big-rating">{storeConfig.rating.toFixed(1).replace(".", ",")}</b>
        <div className="stars" aria-hidden>
          {"★★★★★"}
        </div>
        <b>{storeConfig.reviewsRecent} avaliações</b> • últimos 90 dias
        <br />
        <span className="muted">{storeConfig.reviewsTotal.toLocaleString("pt-BR")} avaliações no total</span>
      </div>

      <div className="review-list">
        {reviews.map((review) => (
          <article key={review.id} className="review-item">
            <div className="review-body">
              <h3>{review.name}</h3>
              <div className="review-meta">
                <span className="score">{review.rating.toFixed(1).replace(".", ",")}</span>
                <span className="stars small" aria-hidden>
                  {"★★★★★"}
                </span>
              </div>
              <p>{review.text}</p>
            </div>
            <div className="review-photo">
              <Image
                src={review.image}
                width={140}
                height={140}
                alt=""
                sizes="70px"
                quality={55}
                loading="lazy"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
