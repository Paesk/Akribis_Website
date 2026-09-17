import siteJson from '../content/site.json';
import partnersJson from '../content/partners.json';

export interface Social {
  network: string;
  handle: string;
  url: string;
  enabled: boolean;
  placeholder: boolean;
}

export const site = siteJson as {
  email: { address: string; placeholder: boolean };
  sponsoring: { name: string; email: string };
  address: { lines: string[]; placeholder: boolean };
  socials: Social[];
};

/** Socials that should be shown: enabled and with a URL. */
export const visibleSocials: Social[] = site.socials.filter((s) => s.enabled && s.url.trim() !== '');

export interface Partner {
  name: string;
  logo: string;
  url: string;
  tier: string;
}

export const partnersData = partnersJson as {
  tiers: { id: string; name: { en: string; de?: string } }[];
  partners: Partner[];
};
