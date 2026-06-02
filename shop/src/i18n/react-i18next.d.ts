import 'react-i18next';

import type { DEFAULT_LANGUAGE, resources } from './index';

declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: (typeof resources)[typeof DEFAULT_LANGUAGE];
    }
}
