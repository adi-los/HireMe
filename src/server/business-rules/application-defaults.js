import { GlideDateTime } from '@servicenow/glide'

/**
 * Before insert on Application — stamp the intake defaults (p.05 step 2).
 * Runs before insert so the values are part of the initial record rather than
 * a second write.
 */
export function applicationDefaults(current) {
    if (!current.getValue('status')) {
        current.setValue('status', 'received')
    }
    if (!current.getValue('applied_date')) {
        current.setValue('applied_date', new GlideDateTime().getValue())
    }
}
