import fs from 'fs'
import path from 'path'
import { Op } from 'sequelize'
import { Language } from './language.model'
import { Exception } from '../../core'

export class LanguageRepository {
  private getLangDir(): string {
    const candidates = [
      path.resolve(__dirname, '../../core/lang'),
      path.resolve(process.cwd(), 'src/core/lang'),
      path.resolve(process.cwd(), 'dist/core/lang'),
    ]
    for (const dir of candidates) {
      if (fs.existsSync(dir)) return dir
    }
    const defaultDir = path.resolve(process.cwd(), 'src/core/lang')
    if (!fs.existsSync(defaultDir)) {
      fs.mkdirSync(defaultDir, { recursive: true })
    }
    return defaultDir
  }

  private getLangFilePath(code: string): string {
    const cleanCode = (code || 'en').toLowerCase().trim()
    return path.join(this.getLangDir(), `${cleanCode}.json`)
  }

  public readTranslationsFile(code: string): Record<string, string> {
    const filePath = this.getLangFilePath(code)
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(content) || {}
      } catch {
        return {}
      }
    }

    // Fallback to English keys if target language file doesn't exist yet
    if (code.toLowerCase() !== 'en') {
      const enPath = this.getLangFilePath('en')
      if (fs.existsSync(enPath)) {
        try {
          const enContent = fs.readFileSync(enPath, 'utf-8')
          const enDict = JSON.parse(enContent) || {}
          const fallback: Record<string, string> = {}
          for (const k of Object.keys(enDict)) {
            fallback[k] = ''
          }
          return fallback
        } catch {
          return {}
        }
      }
    }
    return {}
  }

  public writeTranslationsFile(code: string, dict: Record<string, string>): void {
    const cleanCode = (code || 'en').toLowerCase().trim()
    const primaryDir = this.getLangDir()
    const primaryPath = path.join(primaryDir, `${cleanCode}.json`)
    const jsonContent = JSON.stringify(dict, null, 2)
    fs.writeFileSync(primaryPath, jsonContent, 'utf-8')

    // Also sync to dist/core/lang if it exists
    const altDirs = [
      path.resolve(process.cwd(), 'src/core/lang'),
      path.resolve(process.cwd(), 'dist/core/lang'),
    ]
    for (const altDir of altDirs) {
      if (fs.existsSync(altDir) && path.resolve(altDir) !== path.resolve(primaryDir)) {
        try {
          fs.writeFileSync(path.join(altDir, `${cleanCode}.json`), jsonContent, 'utf-8')
        } catch {
          // ignore sync errors
        }
      }
    }
  }

  async findAll(query: any = {}) {
    const result: any = { items: [], totalCount: 0, message: 'Languages fetched successfully' }
    try {
      const pageNumber = parseInt(query?.pageNumber, 10) || 1
      const pageSize = parseInt(query?.pageSize, 10) || 10
      const sortField = query?.sortField || 'id'
      const sortOrder = (query?.sortOrder || 'asc').toLowerCase() === 'desc' ? 'DESC' : 'ASC'
      const where: any = {}

      if (query?.searchText) {
        where[Op.or] = [
          { name: { [Op.like]: `%${query.searchText}%` } },
          { code: { [Op.like]: `%${query.searchText}%` } },
        ]
      }

      const reserved = ['pageNumber', 'pageSize', 'sortField', 'sortOrder', 'searchText']
      for (const key of Object.keys(query || {})) {
        if (!reserved.includes(key) && query[key] !== undefined && query[key] !== '') {
          where[key] = query[key]
        }
      }

      const { rows, count } = await Language.findAndCountAll({
        where,
        order: [[sortField, sortOrder]],
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
      })

      result.items = rows
      result.totalCount = count
      return result
    } catch (err: any) {
      result.items = []
      result.totalCount = 0
      result.message = err?.message || 'Failed to fetch languages'
      return result
    }
  }

  async findById(id: number | string) {
    const item = await Language.findByPk(id)
    if (!item) throw new Exception({ message: 'Language not found', httpResponseCode: 404 })
    const itemJson = item.toJSON()
    if (item.code) {
      const translations = this.readTranslationsFile(item.code)
      const language_values = Object.keys(translations).map((key) => ({
        name: key,
        value: translations[key] !== undefined && translations[key] !== null ? String(translations[key]) : '',
      }))
      return { ...itemJson, translations, language_values }
    }
    return itemJson
  }

  async create(body: any) {
    try {
      const item = await Language.create(body)
      const code = (item.code || body?.code || '').toLowerCase().trim()
      if (code) {
        const targetPath = this.getLangFilePath(code)
        if (!fs.existsSync(targetPath)) {
          const fallback = this.readTranslationsFile(code)
          this.writeTranslationsFile(code, fallback)
        }
      }
      return item
    } catch (err: any) {
      throw new Exception(err)
    }
  }

  async update(body: any) {
    try {
      const id = body?.id
      const item = await Language.findByPk(id)
      if (!item) throw new Exception({ message: 'Language not found', httpResponseCode: 404 })
      await item.update(body)

      const code = (body?.code || item.code || '').toLowerCase().trim()
      if (code) {
        if (Array.isArray(body?.language_values) && body.language_values.length > 0) {
          const dict: Record<string, string> = {}
          const renamedKeys: Array<{ oldKey: string; newKey: string }> = []

          for (const val of body.language_values) {
            if (val?.name && String(val.name).trim()) {
              const k = String(val.name).trim()
              dict[k] = val.value !== undefined && val.value !== null ? String(val.value) : ''
              if (val.original_name && String(val.original_name).trim() !== k) {
                renamedKeys.push({ oldKey: String(val.original_name).trim(), newKey: k })
              }
            }
          }
          this.writeTranslationsFile(code, dict)

          // If English was updated and keys were renamed, sync renamed keys to other language files
          if (code === 'en' && renamedKeys.length > 0) {
            const langDir = this.getLangDir()
            const files = fs.readdirSync(langDir)
            for (const f of files) {
              if (f.endsWith('.json') && f !== 'en.json') {
                const c = f.replace('.json', '')
                const otherDict = this.readTranslationsFile(c)
                let changed = false
                for (const r of renamedKeys) {
                  if (otherDict[r.oldKey] !== undefined) {
                    otherDict[r.newKey] = otherDict[r.oldKey]
                    delete otherDict[r.oldKey]
                    changed = true
                  }
                }
                if (changed) {
                  this.writeTranslationsFile(c, otherDict)
                }
              }
            }
          }
        } else if (body?.translations && typeof body.translations === 'object') {
          this.writeTranslationsFile(code, body.translations)
        }
      }

      return item
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }

  async destroy(id: number | string) {
    try {
      const item = await Language.findByPk(id)
      if (!item) throw new Exception({ message: 'Language not found', httpResponseCode: 404 })
      await item.destroy()
      return item
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }

  async restore(id: number | string) {
    try {
      const item = await Language.findByPk(id, { paranoid: false })
      if (!item) throw new Exception({ message: 'Language not found', httpResponseCode: 404 })
      await item.restore()
      return item
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }

  async getTranslations(query: any = {}) {
    try {
      let code = (query?.code || '').toLowerCase().trim()
      if (!code && query?.id) {
        const lang = await Language.findByPk(query.id)
        if (lang?.code) code = lang.code.toLowerCase().trim()
      }
      if (!code) code = 'en'

      const dict = this.readTranslationsFile(code)
      let entries: Array<{ name: string; value: string }> = Object.keys(dict).map((key) => ({
        name: key,
        value: dict[key] !== undefined && dict[key] !== null ? String(dict[key]) : '',
      }))

      if (query?.searchText || query?.search) {
        const q = String(query.searchText || query.search).toLowerCase().trim()
        entries = entries.filter(
          (item) => item.name.toLowerCase().includes(q) || item.value.toLowerCase().includes(q)
        )
      }

      const totalCount = entries.length

      if (query?.pageNumber || query?.pageSize) {
        const pageNumber = parseInt(query.pageNumber, 10) || 1
        const pageSize = parseInt(query.pageSize, 10) || 15
        const offset = (pageNumber - 1) * pageSize
        entries = entries.slice(offset, offset + pageSize)
      }

      return {
        code,
        translations: dict,
        language_values: entries,
        totalCount,
        message: 'Translations fetched successfully',
      }
    } catch (err: any) {
      throw new Exception(err)
    }
  }

  async addPhrase(body: any = {}) {
    try {
      let originKey = body?.new_data?.en || body?.en || body?.key || body?.name
      if (!originKey || !String(originKey).trim()) {
        throw new Exception({ message: 'Phrase key is required', httpResponseCode: 400 })
      }
      originKey = String(originKey).trim()

      let targetCode = (body?.code || '').toLowerCase().trim()
      if (!targetCode && body?.id) {
        const lang = await Language.findByPk(body.id)
        if (lang?.code) targetCode = lang.code.toLowerCase().trim()
      }
      if (!targetCode) targetCode = 'en'

      const targetValue = body?.value !== undefined ? body.value : (body?.target !== undefined ? body.target : originKey)

      if (body?.new_data && typeof body.new_data === 'object') {
        for (const langCode of Object.keys(body.new_data)) {
          const c = langCode.toLowerCase().trim()
          const currentDict = this.readTranslationsFile(c)
          currentDict[originKey] = String(body.new_data[langCode] ?? '')
          this.writeTranslationsFile(c, currentDict)
        }
      } else {
        const enDict = this.readTranslationsFile('en')
        if (enDict[originKey] === undefined) {
          enDict[originKey] = body?.en ? String(body.en) : originKey
          this.writeTranslationsFile('en', enDict)
        }

        const targetDict = this.readTranslationsFile(targetCode)
        targetDict[originKey] = String(targetValue)
        this.writeTranslationsFile(targetCode, targetDict)
      }

      return {
        code: targetCode,
        name: originKey,
        key: originKey,
        value: targetValue,
        message: 'Phrase added successfully',
      }
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }

  async updatePhrase(body: any = {}) {
    try {
      let code = (body?.code || '').toLowerCase().trim()
      if (!code && body?.id) {
        const lang = await Language.findByPk(body.id)
        if (lang?.code) code = lang.code.toLowerCase().trim()
      }
      if (!code) code = 'en'

      if (Array.isArray(body?.language_values) && body.language_values.length > 0) {
        const dict: Record<string, string> = {}
        for (const item of body.language_values) {
          if (item?.name && String(item.name).trim()) {
            const k = String(item.name).trim()
            dict[k] = item.value !== undefined && item.value !== null ? String(item.value) : ''
          }
        }
        this.writeTranslationsFile(code, dict)
        return {
          code,
          totalUpdated: Object.keys(dict).length,
          message: 'Translations updated successfully',
        }
      } else if (body?.translations && typeof body.translations === 'object') {
        this.writeTranslationsFile(code, body.translations)
        return {
          code,
          totalUpdated: Object.keys(body.translations).length,
          message: 'Translations updated successfully',
        }
      }

      const key = (body?.key || body?.name || '').trim()
      if (!key) {
        throw new Exception({ message: 'Phrase key is required', httpResponseCode: 400 })
      }
      const oldKey = (body?.old_key || body?.old_name || body?.original_name || '').trim()
      const value = body?.value !== undefined && body?.value !== null ? String(body.value) : ''
      const currentDict = this.readTranslationsFile(code)

      if (oldKey && oldKey !== key && currentDict[oldKey] !== undefined) {
        delete currentDict[oldKey]
      }
      currentDict[key] = value
      this.writeTranslationsFile(code, currentDict)

      // If updating English and key was renamed, sync rename to other language files
      if (code === 'en' && oldKey && oldKey !== key) {
        const langDir = this.getLangDir()
        const files = fs.readdirSync(langDir)
        for (const f of files) {
          if (f.endsWith('.json') && f !== 'en.json') {
            const c = f.replace('.json', '')
            const otherDict = this.readTranslationsFile(c)
            if (otherDict[oldKey] !== undefined) {
              otherDict[key] = otherDict[oldKey]
              delete otherDict[oldKey]
              this.writeTranslationsFile(c, otherDict)
            }
          }
        }
      }

      return {
        code,
        name: key,
        key,
        value,
        message: 'Phrase updated successfully',
      }
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }

  async deletePhrase(queryOrBody: any = {}) {
    try {
      let code = (queryOrBody?.code || '').toLowerCase().trim()
      if (!code && queryOrBody?.id) {
        const lang = await Language.findByPk(queryOrBody.id)
        if (lang?.code) code = lang.code.toLowerCase().trim()
      }
      if (!code) code = 'en'

      const key = queryOrBody?.key || queryOrBody?.name || queryOrBody?.value
      if (!key) {
        throw new Exception({ message: 'Phrase key is required', httpResponseCode: 400 })
      }

      const currentDict = this.readTranslationsFile(code)
      if (currentDict[key] !== undefined) {
        delete currentDict[key]
        this.writeTranslationsFile(code, currentDict)
      }

      if (queryOrBody?.deleteFromAll === true || queryOrBody?.deleteFromAll === 'true') {
        const langDir = this.getLangDir()
        const files = fs.readdirSync(langDir)
        for (const f of files) {
          if (f.endsWith('.json')) {
            const c = f.replace('.json', '')
            if (c !== code) {
              const d = this.readTranslationsFile(c)
              if (d[key] !== undefined) {
                delete d[key]
                this.writeTranslationsFile(c, d)
              }
            }
          }
        }
      }

      return {
        code,
        name: key,
        key,
        message: 'Phrase deleted successfully',
      }
    } catch (err: any) {
      if (err instanceof Exception) throw err
      throw new Exception(err)
    }
  }
}
