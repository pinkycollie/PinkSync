import { neon } from "@neondatabase/serverless"
import type {
  DeveloperSignVideo,
  DeveloperSignCategory,
  DeveloperSignTag,
  DeveloperSignSearchParams,
} from "@/types/developer-sign-language"

const sql = neon(process.env.DATABASE_URL!)

export async function getAllDeveloperSignVideos(params: DeveloperSignSearchParams = {}): Promise<DeveloperSignVideo[]> {
  const {
    query,
    category,
    tags,
    signLanguageType,
    programmingCategory,
    complexity,
    page = 1,
    limit = 20,
    sortBy = "newest",
  } = params

  const offset = (page - 1) * limit

  let queryStr = `
    SELECT 
      ba.id, 
      ba.blob_url as "blobUrl", 
      ba.filename, 
      ba.content_type as "contentType", 
      ba.size_bytes as "sizeBytes", 
      ba.category_id as "categoryId", 
      ba.title, 
      ba.description, 
      ba.language, 
      ba.sign_language_type as "signLanguageType", 
      ba.duration_seconds as "durationSeconds", 
      ba.thumbnail_url as "thumbnailUrl", 
      ba.uploaded_by as "uploadedBy", 
      ba.is_public as "isPublic", 
      ba.created_at as "createdAt", 
      ba.updated_at as "updatedAt",
      COALESCE(bus.view_count, 0) as "viewCount",
      COALESCE(bus.download_count, 0) as "downloadCount",
      ARRAY_AGG(bt.name) FILTER (WHERE bt.name IS NOT NULL) as tags
    FROM 
      blob_assets ba
    LEFT JOIN 
      blob_asset_tags bat ON ba.id = bat.asset_id
    LEFT JOIN 
      blob_tags bt ON bat.tag_id = bt.id
    LEFT JOIN
      blob_usage_stats bus ON ba.id = bus.asset_id
    WHERE 
      ba.is_public = true
  `

  const conditions = []
  const values: any[] = []
  let paramIndex = 1

  if (query) {
    conditions.push(`(
      ba.title ILIKE $${paramIndex} OR 
      ba.description ILIKE $${paramIndex} OR
      EXISTS (SELECT 1 FROM blob_tags bt2 JOIN blob_asset_tags bat2 ON bt2.id = bat2.tag_id WHERE bat2.asset_id = ba.id AND bt2.name ILIKE $${paramIndex})
    )`)
    values.push(`%${query}%`)
    paramIndex++
  }

  if (category) {
    conditions.push(`ba.category_id = $${paramIndex}`)
    values.push(category)
    paramIndex++
  }

  if (signLanguageType) {
    conditions.push(`ba.sign_language_type = $${paramIndex}`)
    values.push(signLanguageType)
    paramIndex++
  }

  if (programmingCategory) {
    conditions.push(`EXISTS (
      SELECT 1 FROM blob_tags bt3 
      JOIN blob_asset_tags bat3 ON bt3.id = bat3.tag_id 
      WHERE bat3.asset_id = ba.id AND bt3.name = $${paramIndex}
    )`)
    values.push(programmingCategory)
    paramIndex++
  }

  if (complexity) {
    conditions.push(`EXISTS (
      SELECT 1 FROM blob_tags bt4 
      JOIN blob_asset_tags bat4 ON bt4.id = bat4.tag_id 
      WHERE bat4.asset_id = ba.id AND bt4.name = $${paramIndex}
    )`)
    values.push(complexity)
    paramIndex++
  }

  if (tags && tags.length > 0) {
    const tagPlaceholders = tags.map((_, i) => `$${paramIndex + i}`).join(", ")
    conditions.push(`EXISTS (
      SELECT 1 FROM blob_asset_tags bat5 
      WHERE bat5.asset_id = ba.id AND bat5.tag_id IN (${tagPlaceholders})
    )`)
    values.push(...tags)
    paramIndex += tags.length
  }

  if (conditions.length > 0) {
    queryStr += ` AND ${conditions.join(" AND ")}`
  }

  queryStr += ` GROUP BY ba.id, bus.view_count, bus.download_count`

  // Add sorting
  switch (sortBy) {
    case "newest":
      queryStr += ` ORDER BY ba.created_at DESC`
      break
    case "oldest":
      queryStr += ` ORDER BY ba.created_at ASC`
      break
    case "popular":
      queryStr += ` ORDER BY "viewCount" DESC`
      break
    case "alphabetical":
      queryStr += ` ORDER BY ba.title ASC`
      break
  }

  queryStr += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
  values.push(limit, offset)

  try {
    const result = await sql<DeveloperSignVideo[]>(queryStr, ...values)
    return result
  } catch (error) {
    console.error("Error fetching developer sign videos:", error)
    throw error
  }
}

export async function getDeveloperSignVideoById(id: number): Promise<DeveloperSignVideo | null> {
  try {
    const queryStr = `
      SELECT 
        ba.id, 
        ba.blob_url as "blobUrl", 
        ba.filename, 
        ba.content_type as "contentType", 
        ba.size_bytes as "sizeBytes", 
        ba.category_id as "categoryId", 
        ba.title, 
        ba.description, 
        ba.language, 
        ba.sign_language_type as "signLanguageType", 
        ba.duration_seconds as "durationSeconds", 
        ba.thumbnail_url as "thumbnailUrl", 
        ba.uploaded_by as "uploadedBy", 
        ba.is_public as "isPublic", 
        ba.created_at as "createdAt", 
        ba.updated_at as "updatedAt",
        COALESCE(bus.view_count, 0) as "viewCount",
        COALESCE(bus.download_count, 0) as "downloadCount",
        ARRAY_AGG(bt.name) FILTER (WHERE bt.name IS NOT NULL) as tags
      FROM 
        blob_assets ba
      LEFT JOIN 
        blob_asset_tags bat ON ba.id = bat.asset_id
      LEFT JOIN 
        blob_tags bt ON bat.tag_id = bt.id
      LEFT JOIN
        blob_usage_stats bus ON ba.id = bus.asset_id
      WHERE 
        ba.id = $1
      GROUP BY 
        ba.id, bus.view_count, bus.download_count
    `

    const result = await sql<DeveloperSignVideo[]>(queryStr, id)

    if (result.length === 0) {
      return null
    }

    return result[0]
  } catch (error) {
    console.error(`Error fetching developer sign video with id ${id}:`, error)
    throw error
  }
}

export async function incrementViewCount(id: number): Promise<void> {
  try {
    // Check if stats record exists
    const checkQuery = `
      SELECT id FROM blob_usage_stats WHERE asset_id = $1
    `
    const existingStats = await sql(checkQuery, id)

    if (existingStats.length === 0) {
      // Create new stats record
      const insertQuery = `
        INSERT INTO blob_usage_stats (asset_id, view_count, download_count, last_accessed, created_at, updated_at)
        VALUES ($1, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `
      await sql(insertQuery, id)
    } else {
      // Update existing stats record
      const updateQuery = `
        UPDATE blob_usage_stats
        SET view_count = view_count + 1, 
            last_accessed = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE asset_id = $1
      `
      await sql(updateQuery, id)
    }
  } catch (error) {
    console.error(`Error incrementing view count for asset ${id}:`, error)
    throw error
  }
}

export async function incrementDownloadCount(id: number): Promise<void> {
  try {
    // Check if stats record exists
    const checkQuery = `
      SELECT id FROM blob_usage_stats WHERE asset_id = $1
    `
    const existingStats = await sql(checkQuery, id)

    if (existingStats.length === 0) {
      // Create new stats record
      const insertQuery = `
        INSERT INTO blob_usage_stats (asset_id, view_count, download_count, last_accessed, created_at, updated_at)
        VALUES ($1, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `
      await sql(insertQuery, id)
    } else {
      // Update existing stats record
      const updateQuery = `
        UPDATE blob_usage_stats
        SET download_count = download_count + 1, 
            last_accessed = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE asset_id = $1
      `
      await sql(updateQuery, id)
    }
  } catch (error) {
    console.error(`Error incrementing download count for asset ${id}:`, error)
    throw error
  }
}

export async function getAllCategories(): Promise<DeveloperSignCategory[]> {
  try {
    const queryStr = `
      SELECT 
        id, 
        name, 
        description, 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM 
        blob_categories
      ORDER BY 
        name ASC
    `

    return await sql<DeveloperSignCategory[]>(queryStr)
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export async function getAllTags(): Promise<DeveloperSignTag[]> {
  try {
    const queryStr = `
      SELECT 
        id, 
        name, 
        created_at as "createdAt"
      FROM 
        blob_tags
      ORDER BY 
        name ASC
    `

    return await sql<DeveloperSignTag[]>(queryStr)
  } catch (error) {
    console.error("Error fetching tags:", error)
    throw error
  }
}

export async function createDeveloperSignVideo(
  data: Omit<DeveloperSignVideo, "id" | "createdAt" | "updatedAt" | "tags" | "viewCount" | "downloadCount"> & {
    tags: string[]
  },
): Promise<DeveloperSignVideo> {
  try {
    // Begin transaction
    await sql`BEGIN`

    // Insert into blob_assets
    const insertAssetQuery = `
      INSERT INTO blob_assets (
        blob_url, 
        filename, 
        content_type, 
        size_bytes, 
        category_id, 
        title, 
        description, 
        language, 
        sign_language_type, 
        duration_seconds, 
        thumbnail_url, 
        uploaded_by, 
        is_public
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      RETURNING 
        id, 
        blob_url as "blobUrl", 
        filename, 
        content_type as "contentType", 
        size_bytes as "sizeBytes", 
        category_id as "categoryId", 
        title, 
        description, 
        language, 
        sign_language_type as "signLanguageType", 
        duration_seconds as "durationSeconds", 
        thumbnail_url as "thumbnailUrl", 
        uploaded_by as "uploadedBy", 
        is_public as "isPublic", 
        created_at as "createdAt", 
        updated_at as "updatedAt"
    `

    const assetResult = await sql<DeveloperSignVideo[]>(
      insertAssetQuery,
      data.blobUrl,
      data.filename,
      data.contentType,
      data.sizeBytes,
      data.categoryId,
      data.title,
      data.description,
      data.language,
      data.signLanguageType,
      data.durationSeconds,
      data.thumbnailUrl,
      data.uploadedBy,
      data.isPublic,
    )

    const newAsset = assetResult[0]

    // Process tags
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        // Check if tag exists
        const tagQuery = `
          SELECT id FROM blob_tags WHERE name = $1
        `
        const existingTag = await sql(tagQuery, tagName)

        let tagId
        if (existingTag.length === 0) {
          // Create new tag
          const createTagQuery = `
            INSERT INTO blob_tags (name)
            VALUES ($1)
            RETURNING id
          `
          const newTag = await sql(createTagQuery, tagName)
          tagId = newTag[0].id
        } else {
          tagId = existingTag[0].id
        }

        // Create asset-tag relationship
        const assetTagQuery = `
          INSERT INTO blob_asset_tags (asset_id, tag_id)
          VALUES ($1, $2)
          ON CONFLICT (asset_id, tag_id) DO NOTHING
        `
        await sql(assetTagQuery, newAsset.id, tagId)
      }
    }

    // Create initial usage stats
    const statsQuery = `
      INSERT INTO blob_usage_stats (asset_id, view_count, download_count, last_accessed)
      VALUES ($1, 0, 0, CURRENT_TIMESTAMP)
    `
    await sql(statsQuery, newAsset.id)

    // Commit transaction
    await sql`COMMIT`

    // Return the created asset with tags
    return {
      ...newAsset,
      tags: data.tags,
      viewCount: 0,
      downloadCount: 0,
    }
  } catch (error) {
    // Rollback transaction on error
    await sql`ROLLBACK`
    console.error("Error creating developer sign video:", error)
    throw error
  }
}

export async function updateDeveloperSignVideo(
  id: number,
  data: Partial<Omit<DeveloperSignVideo, "id" | "createdAt" | "updatedAt" | "viewCount" | "downloadCount">> & {
    tags?: string[]
  },
): Promise<DeveloperSignVideo> {
  try {
    // Begin transaction
    await sql`BEGIN`

    // Build update query dynamically based on provided fields
    const updateFields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (data.blobUrl !== undefined) {
      updateFields.push(`blob_url = $${paramIndex++}`)
      values.push(data.blobUrl)
    }

    if (data.filename !== undefined) {
      updateFields.push(`filename = $${paramIndex++}`)
      values.push(data.filename)
    }

    if (data.contentType !== undefined) {
      updateFields.push(`content_type = $${paramIndex++}`)
      values.push(data.contentType)
    }

    if (data.sizeBytes !== undefined) {
      updateFields.push(`size_bytes = $${paramIndex++}`)
      values.push(data.sizeBytes)
    }

    if (data.categoryId !== undefined) {
      updateFields.push(`category_id = $${paramIndex++}`)
      values.push(data.categoryId)
    }

    if (data.title !== undefined) {
      updateFields.push(`title = $${paramIndex++}`)
      values.push(data.title)
    }

    if (data.description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`)
      values.push(data.description)
    }

    if (data.language !== undefined) {
      updateFields.push(`language = $${paramIndex++}`)
      values.push(data.language)
    }

    if (data.signLanguageType !== undefined) {
      updateFields.push(`sign_language_type = $${paramIndex++}`)
      values.push(data.signLanguageType)
    }

    if (data.durationSeconds !== undefined) {
      updateFields.push(`duration_seconds = $${paramIndex++}`)
      values.push(data.durationSeconds)
    }

    if (data.thumbnailUrl !== undefined) {
      updateFields.push(`thumbnail_url = $${paramIndex++}`)
      values.push(data.thumbnailUrl)
    }

    if (data.uploadedBy !== undefined) {
      updateFields.push(`uploaded_by = $${paramIndex++}`)
      values.push(data.uploadedBy)
    }

    if (data.isPublic !== undefined) {
      updateFields.push(`is_public = $${paramIndex++}`)
      values.push(data.isPublic)
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)

    // Add the id as the last parameter
    values.push(id)

    if (updateFields.length > 0) {
      const updateQuery = `
        UPDATE blob_assets
        SET ${updateFields.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING 
          id, 
          blob_url as "blobUrl", 
          filename, 
          content_type as "contentType", 
          size_bytes as "sizeBytes", 
          category_id as "categoryId", 
          title, 
          description, 
          language, 
          sign_language_type as "signLanguageType", 
          duration_seconds as "durationSeconds", 
          thumbnail_url as "thumbnailUrl", 
          uploaded_by as "uploadedBy", 
          is_public as "isPublic", 
          created_at as "createdAt", 
          updated_at as "updatedAt"
      `

      await sql(updateQuery, ...values)
    }

    // Update tags if provided
    if (data.tags !== undefined) {
      // Remove existing tags
      const deleteTagsQuery = `
        DELETE FROM blob_asset_tags
        WHERE asset_id = $1
      `
      await sql(deleteTagsQuery, id)

      // Add new tags
      for (const tagName of data.tags) {
        // Check if tag exists
        const tagQuery = `
          SELECT id FROM blob_tags WHERE name = $1
        `
        const existingTag = await sql(tagQuery, tagName)

        let tagId
        if (existingTag.length === 0) {
          // Create new tag
          const createTagQuery = `
            INSERT INTO blob_tags (name)
            VALUES ($1)
            RETURNING id
          `
          const newTag = await sql(createTagQuery, tagName)
          tagId = newTag[0].id
        } else {
          tagId = existingTag[0].id
        }

        // Create asset-tag relationship
        const assetTagQuery = `
          INSERT INTO blob_asset_tags (asset_id, tag_id)
          VALUES ($1, $2)
          ON CONFLICT (asset_id, tag_id) DO NOTHING
        `
        await sql(assetTagQuery, id, tagId)
      }
    }

    // Commit transaction
    await sql`COMMIT`

    // Return the updated asset
    return (await getDeveloperSignVideoById(id)) as DeveloperSignVideo
  } catch (error) {
    // Rollback transaction on error
    await sql`ROLLBACK`
    console.error(`Error updating developer sign video with id ${id}:`, error)
    throw error
  }
}

export async function deleteDeveloperSignVideo(id: number): Promise<boolean> {
  try {
    // Begin transaction
    await sql`BEGIN`

    // Delete asset-tag relationships
    const deleteTagsQuery = `
      DELETE FROM blob_asset_tags
      WHERE asset_id = $1
    `
    await sql(deleteTagsQuery, id)

    // Delete usage stats
    const deleteStatsQuery = `
      DELETE FROM blob_usage_stats
      WHERE asset_id = $1
    `
    await sql(deleteStatsQuery, id)

    // Delete the asset
    const deleteAssetQuery = `
      DELETE FROM blob_assets
      WHERE id = $1
      RETURNING id
    `
    const result = await sql(deleteAssetQuery, id)

    // Commit transaction
    await sql`COMMIT`

    return result.length > 0
  } catch (error) {
    // Rollback transaction on error
    await sql`ROLLBACK`
    console.error(`Error deleting developer sign video with id ${id}:`, error)
    throw error
  }
}

export async function getPopularDeveloperSignVideos(limit = 10): Promise<DeveloperSignVideo[]> {
  try {
    const queryStr = `
      SELECT 
        ba.id, 
        ba.blob_url as "blobUrl", 
        ba.filename, 
        ba.content_type as "contentType", 
        ba.size_bytes as "sizeBytes", 
        ba.category_id as "categoryId", 
        ba.title, 
        ba.description, 
        ba.language, 
        ba.sign_language_type as "signLanguageType", 
        ba.duration_seconds as "durationSeconds", 
        ba.thumbnail_url as "thumbnailUrl", 
        ba.uploaded_by as "uploadedBy", 
        ba.is_public as "isPublic", 
        ba.created_at as "createdAt", 
        ba.updated_at as "updatedAt",
        COALESCE(bus.view_count, 0) as "viewCount",
        COALESCE(bus.download_count, 0) as "downloadCount",
        ARRAY_AGG(bt.name) FILTER (WHERE bt.name IS NOT NULL) as tags
      FROM 
        blob_assets ba
      LEFT JOIN 
        blob_asset_tags bat ON ba.id = bat.asset_id
      LEFT JOIN 
        blob_tags bt ON bat.tag_id = bt.id
      LEFT JOIN
        blob_usage_stats bus ON ba.id = bus.asset_id
      WHERE 
        ba.is_public = true
      GROUP BY 
        ba.id, bus.view_count, bus.download_count
      ORDER BY 
        bus.view_count DESC NULLS LAST
      LIMIT $1
    `

    return await sql<DeveloperSignVideo[]>(queryStr, limit)
  } catch (error) {
    console.error("Error fetching popular developer sign videos:", error)
    throw error
  }
}

export async function getRecentDeveloperSignVideos(limit = 10): Promise<DeveloperSignVideo[]> {
  try {
    const queryStr = `
      SELECT 
        ba.id, 
        ba.blob_url as "blobUrl", 
        ba.filename, 
        ba.content_type as "contentType", 
        ba.size_bytes as "sizeBytes", 
        ba.category_id as "categoryId", 
        ba.title, 
        ba.description, 
        ba.language, 
        ba.sign_language_type as "signLanguageType", 
        ba.duration_seconds as "durationSeconds", 
        ba.thumbnail_url as "thumbnailUrl", 
        ba.uploaded_by as "uploadedBy", 
        ba.is_public as "isPublic", 
        ba.created_at as "createdAt", 
        ba.updated_at as "updatedAt",
        COALESCE(bus.view_count, 0) as "viewCount",
        COALESCE(bus.download_count, 0) as "downloadCount",
        ARRAY_AGG(bt.name) FILTER (WHERE bt.name IS NOT NULL) as tags
      FROM 
        blob_assets ba
      LEFT JOIN 
        blob_asset_tags bat ON ba.id = bat.asset_id
      LEFT JOIN 
        blob_tags bt ON bat.tag_id = bt.id
      LEFT JOIN
        blob_usage_stats bus ON ba.id = bus.asset_id
      WHERE 
        ba.is_public = true
      GROUP BY 
        ba.id, bus.view_count, bus.download_count
      ORDER BY 
        ba.created_at DESC
      LIMIT $1
    `

    return await sql<DeveloperSignVideo[]>(queryStr, limit)
  } catch (error) {
    console.error("Error fetching recent developer sign videos:", error)
    throw error
  }
}

export async function getDeveloperSignVideosByCategory(categoryId: number, limit = 20): Promise<DeveloperSignVideo[]> {
  try {
    const queryStr = `
      SELECT 
        ba.id, 
        ba.blob_url as "blobUrl", 
        ba.filename, 
        ba.content_type as "contentType", 
        ba.size_bytes as "sizeBytes", 
        ba.category_id as "categoryId", 
        ba.title, 
        ba.description, 
        ba.language, 
        ba.sign_language_type as "signLanguageType", 
        ba.duration_seconds as "durationSeconds", 
        ba.thumbnail_url as "thumbnailUrl", 
        ba.uploaded_by as "uploadedBy", 
        ba.is_public as "isPublic", 
        ba.created_at as "createdAt", 
        ba.updated_at as "updatedAt",
        COALESCE(bus.view_count, 0) as "viewCount",
        COALESCE(bus.download_count, 0) as "downloadCount",
        ARRAY_AGG(bt.name) FILTER (WHERE bt.name IS NOT NULL) as tags
      FROM 
        blob_assets ba
      LEFT JOIN 
        blob_asset_tags bat ON ba.id = bat.asset_id
      LEFT JOIN 
        blob_tags bt ON bat.tag_id = bt.id
      LEFT JOIN
        blob_usage_stats bus ON ba.id = bus.asset_id
      WHERE 
        ba.is_public = true AND
        ba.category_id = $1
      GROUP BY 
        ba.id, bus.view_count, bus.download_count
      ORDER BY 
        ba.created_at DESC
      LIMIT $2
    `

    return await sql<DeveloperSignVideo[]>(queryStr, categoryId, limit)
  } catch (error) {
    console.error(`Error fetching developer sign videos for category ${categoryId}:`, error)
    throw error
  }
}

export async function getDeveloperSignVideosByTag(tagName: string, limit = 20): Promise<DeveloperSignVideo[]> {
  try {
    const queryStr = `
      SELECT 
        ba.id, 
        ba.blob_url as "blobUrl", 
        ba.filename, 
        ba.content_type as "contentType", 
        ba.size_bytes as "sizeBytes", 
        ba.category_id as "categoryId", 
        ba.title, 
        ba.description, 
        ba.language, 
        ba.sign_language_type as "signLanguageType", 
        ba.duration_seconds as "durationSeconds", 
        ba.thumbnail_url as "thumbnailUrl", 
        ba.uploaded_by as "uploadedBy", 
        ba.is_public as "isPublic", 
        ba.created_at as "createdAt", 
        ba.updated_at as "updatedAt",
        COALESCE(bus.view_count, 0) as "viewCount",
        COALESCE(bus.download_count, 0) as "downloadCount",
        ARRAY_AGG(bt.name) FILTER (WHERE bt.name IS NOT NULL) as tags
      FROM 
        blob_assets ba
      JOIN 
        blob_asset_tags bat ON ba.id = bat.asset_id
      JOIN 
        blob_tags bt ON bat.tag_id = bt.id
      LEFT JOIN
        blob_usage_stats bus ON ba.id = bus.asset_id
      WHERE 
        ba.is_public = true AND
        bt.name = $1
      GROUP BY 
        ba.id, bus.view_count, bus.download_count
      ORDER BY 
        ba.created_at DESC
      LIMIT $2
    `

    return await sql<DeveloperSignVideo[]>(queryStr, tagName, limit)
  } catch (error) {
    console.error(`Error fetching developer sign videos for tag ${tagName}:`, error)
    throw error
  }
}

export async function countDeveloperSignVideos(params: DeveloperSignSearchParams = {}): Promise<number> {
  const { query, category, tags, signLanguageType, programmingCategory, complexity } = params

  let queryStr = `
    SELECT 
      COUNT(DISTINCT ba.id)
    FROM 
      blob_assets ba
    LEFT JOIN 
      blob_asset_tags bat ON ba.id = bat.asset_id
    LEFT JOIN 
      blob_tags bt ON bat.tag_id = bt.id
    WHERE 
      ba.is_public = true
  `

  const conditions = []
  const values: any[] = []
  let paramIndex = 1

  if (query) {
    conditions.push(`(
      ba.title ILIKE $${paramIndex} OR 
      ba.description ILIKE $${paramIndex} OR
      EXISTS (SELECT 1 FROM blob_tags bt2 JOIN blob_asset_tags bat2 ON bt2.id = bat2.tag_id WHERE bat2.asset_id = ba.id AND bt2.name ILIKE $${paramIndex})
    )`)
    values.push(`%${query}%`)
    paramIndex++
  }

  if (category) {
    conditions.push(`ba.category_id = $${paramIndex}`)
    values.push(category)
    paramIndex++
  }

  if (signLanguageType) {
    conditions.push(`ba.sign_language_type = $${paramIndex}`)
    values.push(signLanguageType)
    paramIndex++
  }

  if (programmingCategory) {
    conditions.push(`EXISTS (
      SELECT 1 FROM blob_tags bt3 
      JOIN blob_asset_tags bat3 ON bt3.id = bat3.tag_id 
      WHERE bat3.asset_id = ba.id AND bt3.name = $${paramIndex}
    )`)
    values.push(programmingCategory)
    paramIndex++
  }

  if (complexity) {
    conditions.push(`EXISTS (
      SELECT 1 FROM blob_tags bt4 
      JOIN blob_asset_tags bat4 ON bt4.id = bat4.tag_id 
      WHERE bat4.asset_id = ba.id AND bt4.name = $${paramIndex}
    )`)
    values.push(complexity)
    paramIndex++
  }

  if (tags && tags.length > 0) {
    const tagPlaceholders = tags.map((_, i) => `$${paramIndex + i}`).join(", ")
    conditions.push(`EXISTS (
      SELECT 1 FROM blob_asset_tags bat5 
      WHERE bat5.asset_id = ba.id AND bat5.tag_id IN (${tagPlaceholders})
    )`)
    values.push(...tags)
    paramIndex += tags.length
  }

  if (conditions.length > 0) {
    queryStr += ` AND ${conditions.join(" AND ")}`
  }

  try {
    const result = await sql<[{ count: number }]>(queryStr, ...values)
    return Number.parseInt(result[0].count as unknown as string, 10)
  } catch (error) {
    console.error("Error counting developer sign videos:", error)
    throw error
  }
}
