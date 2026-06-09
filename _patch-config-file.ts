/**
 * Replace the defaults block between `// @shader-config-start` and
 * `// @shader-config-end` markers in a shader config module.
 *
 * Pass the symbol name (e.g. `ACCENT_SHADER_DEFAULTS` or `WAVE_SHADER_DEFAULTS`)
 * so the same helper works across any shader's config file.
 */
export function patchShaderConfigDefaults(
  source: string,
  exportName: string,
  serializedDefaults: string,
): string {
  const start = "// @shader-config-start"
  const end = "// @shader-config-end"
  const startIdx = source.indexOf(start)
  const endIdx = source.indexOf(end)
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    throw new Error("Config file missing @shader-config markers")
  }

  const before = source.slice(0, startIdx + start.length)
  const after = source.slice(endIdx)
  return `${before}\nexport const ${exportName} = ${serializedDefaults} as const\n${after}`
}
