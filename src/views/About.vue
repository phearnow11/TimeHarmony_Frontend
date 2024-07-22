<template>
  <div class="container mx-auto p-4 text-white">
    <!-- Main Section -->
    <div class="text-center py-12">
      <h1 class="text-4xl font-bold mb-4">Chúng tôi yêu thích các nhà sáng tạo</h1>
      <p class="text-xl mb-6">Chào mừng bạn đến với Time Harmony, nền tảng hàng đầu để mua và bán đồng hồ vintage. Chúng tôi cung cấp một trải nghiệm mua sắm và bán hàng liền mạch và an toàn cho cả người mua và người bán.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <p class="mb-4">Chúng tôi hiểu rằng việc mua một chiếc đồng hồ vintage là một khoản đầu tư, vì vậy chúng tôi cam kết cung cấp dịch vụ đáng tin cậy và minh bạch nhất. Cho dù bạn đang tìm kiếm một chiếc đồng hồ mới hay muốn bán một món đồ quý giá, chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
        <p class="mb-4">Mỗi chiếc đồng hồ được niêm yết trên trang của chúng tôi đều được thẩm định bởi các chuyên gia hàng đầu, đảm bảo rằng mỗi sản phẩm đều hoàn toàn đáng tin cậy và chính hãng. Đội ngũ chuyên gia của chúng tôi có nhiều năm kinh nghiệm trong ngành công nghiệp đồng hồ và họ sẽ đánh giá chi tiết từng sản phẩm để cung cấp các đánh giá chính xác và chi tiết.</p>
        <p class="mb-4">Cảm ơn bạn đã chọn Time Harmony. Chúng tôi rất mong được phục vụ bạn và đảm bảo sự hài lòng tuyệt đối trong mỗi giao dịch.</p>
        <p class="mb-4">Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, vui lòng <router-link to="/contact" class="text-blue-500 hover:underline">liên hệ với chúng tôi</router-link>.</p>
      </div>
    </div>
    
    <!-- Statistics Section -->
    <div class="flex flex-wrap justify-around py-12">
      <div class="flex flex-col items-center w-1/2 md:w-1/4 p-4">
        <h2 class="text-3xl font-bold">2012</h2>
        <p class="text-xl">Nền tảng được thành lập</p>
      </div>
      <div class="flex flex-col items-center w-1/2 md:w-1/4 p-4">
        <h2 class="text-3xl font-bold">120+</h2>
        <p class="text-xl">Người trong đội ngũ</p>
      </div>
      <div class="flex flex-col items-center w-1/2 md:w-1/4 p-4">
        <h2 class="text-3xl font-bold">250k</h2>
        <p class="text-xl">Người dùng trên nền tảng</p>
      </div>
      <div class="flex flex-col items-center w-1/2 md:w-1/4 p-4">
        <h2 class="text-3xl font-bold">$70M</h2>
        <p class="text-xl">Số tiền đã chi trả cho các nhà sáng tạo</p>
      </div>
    </div>
    
    <!-- Values Section -->
    <div class="py-12 text-center">
      <h2 class="text-4xl font-bold mb-6">Giá trị của chúng tôi</h2>
      <p class="text-xl mb-8">Chúng tôi luôn cam kết mang đến sự hoàn hảo trong dịch vụ của mình và không ngừng học hỏi để phục vụ bạn tốt nhất.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
        <div class="mb-4">
          <h3 class="text-2xl font-bold mb-2">Trở nên đẳng cấp</h3>
          <p>Chúng tôi luôn phấn đấu để trở thành những người dẫn đầu trong ngành công nghiệp đồng hồ vintage.</p>
        </div>
        <div class="mb-4">
          <h3 class="text-2xl font-bold mb-2">Hỗ trợ tận tình</h3>
          <p>Chúng tôi luôn sẵn sàng hỗ trợ và giúp đỡ bạn trong mọi vấn đề liên quan đến việc mua và bán đồng hồ.</p>
        </div>
        <div class="mb-4">
          <h3 class="text-2xl font-bold mb-2">Chia sẻ kiến thức</h3>
          <p>Chúng tôi sẵn sàng chia sẻ tất cả những gì chúng tôi biết để giúp bạn đưa ra những quyết định tốt nhất.</p>
        </div>
        <div class="mb-4">
          <h3 class="text-2xl font-bold mb-2">Nhận trách nhiệm</h3>
          <p>Chúng tôi luôn nhận trách nhiệm và cam kết thực hiện công việc của mình một cách tốt nhất.</p>
        </div>
        <div class="mb-4">
          <h3 class="text-2xl font-bold mb-2">Luôn học hỏi</h3>
          <p>Chúng tôi không ngừng học hỏi và cải thiện để cung cấp dịch vụ ngày càng tốt hơn cho bạn.</p>
        </div>
        <div class="mb-4">
          <h3 class="text-2xl font-bold mb-2">Tận hưởng thời gian nghỉ ngơi</h3>
          <p>Chúng tôi hiểu rằng sự cân bằng giữa công việc và nghỉ ngơi là rất quan trọng.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutUs"
}
</script>

<style scoped>
.container {
  font-family: sans-serif;
  color: #fff;
}

.bg-dark-blue {
  background-color: #0A2540;
}

.bg-dark-blue-light {
  background-color: #14263D;
}

.text-blue-500:hover {
  text-decoration: underline;
}
</style>
