import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{t('privacy.title')}</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('privacy.collectedInfo')}</h2>
        <p className="mb-4">
          {t('privacy.collectedInfoDesc')}
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>{t('privacy.registrationInfo')}</li>
          <li>{t('privacy.commandImages')}</li>
          <li>{t('privacy.usageData')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('privacy.howWeUse')}</h2>
        <p className="mb-4">
          {t('privacy.howWeUseDesc')}
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>{t('privacy.provideServices')}</li>
          <li>{t('privacy.processCommands')}</li>
          <li>{t('privacy.sendUpdates')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('privacy.dataDeletion')}</h2>
        <p className="mb-4">
          {t('privacy.dataDeletionDesc')}
        </p>
        <ol className="list-decimal pl-6 mb-4">
          <li>{t('privacy.loginStep')}</li>
          <li>{t('privacy.settingsStep')}</li>
          <li>{t('privacy.deleteStep')}</li>
          <li>{t('privacy.confirmStep')}</li>
        </ol>
        <p>
          {t('privacy.deletionNote')}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t('privacy.contact')}</h2>
        <p>
          {t('privacy.contactDesc')}
          <br />
          <a href="mailto:privacy@handsheet.com" className="text-primary hover:underline">
            privacy@handsheet.com
          </a>
        </p>
      </section>

      <p className="text-sm text-muted-foreground">
        {t('privacy.lastUpdated')} {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default PrivacyPolicy; 