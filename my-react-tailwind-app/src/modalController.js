let openAuthModalFn = null

export const modalController = {
    setOpenAuthModal(fn) {
        openAuthModalFn = fn
    },
    openAuthModal() {
        if (openAuthModalFn) openAuthModalFn()
    }
}