import {Social, socialHeading, socialLinks} from '../../../data/socials';

const socialIcons = {
  instagram: 'bi-instagram',
  facebook: 'bi-facebook',
};

const socialIconStyle = {
  instagram: {
    'color': 'rgba(214, 58, 139, 1)',
    // Does not work on iOS
    // 'background': `linear-gradient(45deg,rgba(115, 42, 155, 1) 0%,
    // rgba(173, 76, 76, 1) 50%, rgba(255, 179, 0, 1) 100%)`,
    // 'WebkitBackgroundClip': 'text',
    // 'WebkitTextFillColor': 'transparent',
  },
  facebook: {
    color: '#0d6efd',
  },
};

export const SocialAd: React.VFC = () => {
  return (
    <>
      <span className="d-none d-lg-block small">
        {socialHeading}
      </span>
      <div className="d-flex gap-2">
        {(Object.entries(socialLinks) as [Social, string][]).map(
            ([social, link]) => (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                type="button"
                className="btn p-1"
                key={social}
                title={`Följ oss på ${social}`}
              >
                <i
                  className={`bi ${socialIcons[social]}`}
                  style={socialIconStyle[social]}
                ></i>
              </a>
            ),
        )}
      </div>
    </>
  );
};
