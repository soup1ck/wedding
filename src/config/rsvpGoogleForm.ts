type RsvpGoogleFormConfig = {
  formAction: string;
  fields: {
    fullName: string;
    phone: string;
    attending: string;
    favoriteTrack: string;
    drinkPreferences?: string;
    message: string;
  };
};

export const rsvpGoogleForm: RsvpGoogleFormConfig = {
  formAction:
    "https://docs.google.com/forms/d/e/1FAIpQLSc-FGLizU8RRoHxNm2PaFkbIFS-V0WZC1Zijl6VrO9mAjpDrw/formResponse",
  fields: {
    fullName: "entry.1040310425",
    phone: "entry.1887180472",
    attending: "entry.227286450",
    favoriteTrack: "entry.491364843",
    drinkPreferences: "entry.2050312024",
    message: "entry.485752866",
  },
};

export const isRsvpGoogleFormConfigured = (
  config: RsvpGoogleFormConfig,
): boolean =>
  Boolean(config.formAction) &&
  Boolean(config.fields.fullName) &&
  Boolean(config.fields.phone) &&
  Boolean(config.fields.attending) &&
  Boolean(config.fields.favoriteTrack) &&
  Boolean(config.fields.message);
