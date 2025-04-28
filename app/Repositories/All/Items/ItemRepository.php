<?php

namespace App\Repositories\All\Items;

use App\Models\Item;
use App\Repositories\Base\BaseRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

class ItemRepository extends BaseRepository implements ItemInterface
{
    protected $model;

    public function __construct(Item $model)
    {
        parent::__construct($model);
        $this->model = $model;
    }

    /**
     * Get items by business IDs with specified relations.
     */
    public function getByBusinessIds(array $businessIds, array $columns = ['*'], array $relations = []): EloquentCollection
    {
        // Always eager-load business & collection if not already requested
        foreach (['business','collection'] as $rel) {
            if (! in_array($rel, $relations)) {
                $relations[] = $rel;
            }
        }

        return $this->model
                    ->select($columns)
                    ->with($relations)
                    ->whereIn('business_id', $businessIds)
                    ->get();
    }
}
