export type Social = 'instagram' | 'facebook';
export type SocialLinks = Partial<Record<Social, string>>;

/**
 * Text shown before social icons
 */
export const socialHeading =
  'Följ oss på sociala medier för att veta när nya bilder läggs upp!';

/**
 * Specify links to social media
 */
export const socialLinks: SocialLinks = {
  instagram: 'https://www.instagram.com/fotonchalmers/',
  facebook: 'https://www.facebook.com/FotonChalmers',
};
