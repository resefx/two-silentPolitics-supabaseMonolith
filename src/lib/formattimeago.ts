'use client';

export const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) return `${Math.floor(interval)}a`
    interval = seconds / 2592000
    if (interval > 1) return `${Math.floor(interval)}m`
    interval = seconds / 86400
    if (interval > 1) return `${Math.floor(interval)}d`
    interval = seconds / 3600
    if (interval > 1) return `${Math.floor(interval)}h`
    interval = seconds / 60
    if (interval > 1) return `${Math.floor(interval)}min`
    return `${Math.floor(seconds)}s`
}
