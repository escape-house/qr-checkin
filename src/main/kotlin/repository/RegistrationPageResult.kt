package at.escapehouse.repository

import at.escapehouse.data.DeclarationOfConsent

data class RegistrationPageResult(
    val items: List<DeclarationOfConsent>,
    val totalItems: Long,
)