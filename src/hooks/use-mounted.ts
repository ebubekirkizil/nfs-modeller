"use client";

import { useSyncExternalStore } from "react";

// Abonelik gerekmiyor: değer hidrasyondan sonra sabit kalır.
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Sunucuda `false`, hidrasyondan sonra `true` döner.
 *
 * next-themes'in `resolvedTheme` değeri sunucuda bilinemez (localStorage'a
 * bakar). Temaya göre farklı DOM üreten yerlerde bu kancayla beklemek gerekir,
 * yoksa sunucu ile istemci çıktısı uyuşmaz (hydration hatası).
 *
 * `useEffect` + `setState` yerine `useSyncExternalStore`: React 19'da sunucu ve
 * istemci anlık görüntüsünü ayırmanın doğrudan yolu bu, ayrıca render sonrası
 * fazladan bir state güncellemesi tetiklemez.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
