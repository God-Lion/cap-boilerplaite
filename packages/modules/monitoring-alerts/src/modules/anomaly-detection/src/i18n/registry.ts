import en from '../data/dictionaries/en.json'
import ar from '../data/dictionaries/ar.json'
import fr from '../data/dictionaries/fr.json'

export const monitoringAlertsDictionary = {
  en,
  ar,
  fr,
}

export const registerDictionary = (dict: typeof monitoringAlertsDictionary) => {
  if (typeof window !== 'undefined') {
    (window as any).__MONITORING_ALERTS_DICT__ = dict
  }
}

export const getMergedDictionary = (lang: string) => {
  return monitoringAlertsDictionary[lang as keyof typeof monitoringAlertsDictionary] || monitoringAlertsDictionary.en
}
